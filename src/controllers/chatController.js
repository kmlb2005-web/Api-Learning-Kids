
const mongoose = require("mongoose");
const Model = require("../models/Chat");
const OpenAI = require("openai");

const references = { studentId: "Student" };
const populateFields = ["studentId"];

// Configuración de OpenRouter
const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY
});

// Genera handlers CRUD y valida las referencias de MongoDB.
const createHandlers = () => {
  const populate = (query) => {
    for (const field of populateFields) {
      query = query.populate(field);
    }
    return query;
  };

  const checkReferences = async (data) => {
    for (const [field, modelName] of Object.entries(references)) {
      if (field.includes(".") || data[field] == null || data[field] === "") {
        continue;
      }

      if (!mongoose.isValidObjectId(data[field])) {
        return "La referencia " + field + " no tiene un identificador válido";
      }

      if (!(await mongoose.model(modelName).exists({ _id: data[field] }))) {
        return "La referencia " + field + " no existe";
      }
    }

    if (Array.isArray(data.answers)) {
      for (const answer of data.answers) {
        if (answer.questionId == null) continue;

        if (!mongoose.isValidObjectId(answer.questionId)) {
          return "La referencia questionId no tiene un identificador válido";
        }

        if (!(await mongoose.model("Question").exists({
          _id: answer.questionId
        }))) {
          return "La pregunta referenciada no existe";
        }
      }
    }

    return null;
  };

  const fail = (res, error, action) => {
    if (error.code === 11000 && Model.modelName === "User") {
      return res.status(400).json({
        message: "El nombre de usuario ya existe"
      });
    }

    if (
      error.name === "ValidationError" ||
      error.name === "CastError" ||
      error.code === 11000
    ) {
      return res.status(400).json({
        message: "Los datos enviados no son válidos",
        error: error.message
      });
    }

    console.error("Error en Chat:", error.message);

    return res.status(500).json({
      message: "Error al " + action + " conversación",
      error: error.message
    });
  };

  return {
    // Crear conversación
    create: async (req, res) => {
      try {
        const issue = await checkReferences(req.body);
        if (issue) {
          return res.status(400).json({ message: issue });
        }

        const created = await Model.create(req.body);
        const data = await populate(Model.findById(created._id));

        return res.status(201).json({
          message: "Conversación creada correctamente",
          data
        });
      } catch (error) {
        return fail(res, error, "crear");
      }
    },

    // Obtener todas las conversaciones
    getAll: async (req, res) => {
      try {
        const data = await populate(Model.find());

        return res.status(200).json({
          message: "Registros de conversación obtenidos correctamente",
          data
        });
      } catch (error) {
        return fail(res, error, "obtener");
      }
    },

    // Obtener conversación por ID
    getById: async (req, res) => {
      try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
          return res.status(400).json({
            message: "El identificador no es válido"
          });
        }

        const data = await populate(Model.findById(id));

        if (!data) {
          return res.status(404).json({
            message: "Conversación no encontrada"
          });
        }

        return res.status(200).json({
          message: "Conversación obtenida correctamente",
          data
        });
      } catch (error) {
        return fail(res, error, "obtener");
      }
    },

    // Actualizar conversación
    update: async (req, res) => {
      try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
          return res.status(400).json({
            message: "El identificador no es válido"
          });
        }

        const existing = await Model.findById(id);

        if (!existing) {
          return res.status(404).json({
            message: "Conversación no encontrada"
          });
        }

        const issue = await checkReferences(req.body);
        if (issue) {
          return res.status(400).json({ message: issue });
        }

        const data = await populate(
          Model.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
          })
        );

        return res.status(200).json({
          message: "Conversación actualizada correctamente",
          data
        });
      } catch (error) {
        return fail(res, error, "actualizar");
      }
    },

    // Eliminar conversación
    remove: async (req, res) => {
      try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
          return res.status(400).json({
            message: "El identificador no es válido"
          });
        }

        const data = await Model.findByIdAndDelete(id);

        if (!data) {
          return res.status(404).json({
            message: "Conversación no encontrada"
          });
        }

        return res.status(200).json({
          message: "Conversación eliminada correctamente"
        });
      } catch (error) {
        return fail(res, error, "eliminar");
      }
    },

    // Consultar la IA de OpenRouter
    askAI: async (req, res) => {
      try {
        const { message } = req.body;

        if (
          typeof message !== "string" ||
          !message.trim()
        ) {
          return res.status(400).json({
            message: "Debes escribir una pregunta."
          });
        }

        if (!process.env.OPENROUTER_API_KEY) {
          return res.status(500).json({
            message: "La clave de OpenRouter no está configurada."
          });
        }

        const response = await openrouter.chat.completions.create({
          model: "recursive/flint-v1.0:free",
          messages: [
            {
              role: "system",
              content: `
                Eres Louz, el asistente educativo de LearningKids.
                Ayudas a estudiantes de primaria.
                Responde en español, con palabras sencillas,
                ejemplos y explicaciones paso a paso.
                Atiende preguntas relacionadas con materias escolares.
                Si una pregunta no es educativa, explica amablemente
                que solo puedes ayudar con temas escolares.
              `
            },
            {
              role: "user",
              content: message.trim()
            }
          ]
        });

        const answer = response.choices?.[0]?.message?.content;

        if (!answer) {
          return res.status(502).json({
            message: "La IA no devolvió una respuesta."
          });
        }

        return res.status(200).json({
          message: "Respuesta generada correctamente",
          question: message.trim(),
          answer
        });
      } catch (error) {
        console.error("Error de OpenRouter:", error.message);

        return res.status(502).json({
          message: "No fue posible obtener una respuesta de la IA.",
          error: error.status === 429
            ? "Se alcanzó un límite de uso. Intenta más tarde."
            : "Verifica la configuración y disponibilidad del servicio."
        });
      }
    }
  };
};

const handlers = createHandlers();

module.exports = {
  createChat: handlers.create,
  getChats: handlers.getAll,
  getChatById: handlers.getById,
  updateChat: handlers.update,
  deleteChat: handlers.remove,
  askAI: handlers.askAI
};
