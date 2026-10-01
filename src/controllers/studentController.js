const mongoose = require("mongoose");
const Model = require("../models/Student");
const references = {"userId":"User","tutorId":"Tutor"};
const populateFields = ["userId","tutorId"];

// Genera handlers CRUD asíncronos y valida referencias con consultas de Mongoose.
const createHandlers = () => {
  const populate = (query) => { for (const field of populateFields) query = query.populate(field); return query; };
  const checkReferences = async (data) => {
    for (const [field, modelName] of Object.entries(references)) {
      if (field.includes(".") || data[field] == null || data[field] === "") continue;
      if (!mongoose.isValidObjectId(data[field])) return "La referencia " + field + " no tiene un identificador válido";
      if (!(await mongoose.model(modelName).exists({ _id: data[field] }))) return "La referencia " + field + " no existe";
    }
    if (Array.isArray(data.answers)) for (const answer of data.answers) {
      if (answer.questionId == null) continue;
      if (!mongoose.isValidObjectId(answer.questionId)) return "La referencia questionId no tiene un identificador válido";
      if (!(await mongoose.model("Question").exists({ _id: answer.questionId }))) return "La pregunta referenciada no existe";
    }
    return null;
  };
  const fail = (res, error, action) => {
    if (error.code === 11000 && Model.modelName === "User") return res.status(400).json({ message: "El nombre de usuario ya existe" });
    if (error.name === "ValidationError" || error.name === "CastError" || error.code === 11000) return res.status(400).json({ message: "Los datos enviados no son válidos", error: error.message });
    return res.status(500).json({ message: "Error al " + action + " alumno", error: error.message });
  };
  return {
    create: async (req,res) => { try { const issue=await checkReferences(req.body); if(issue) return res.status(400).json({message:issue}); const created=await Model.create(req.body); const data=await populate(Model.findById(created._id)); return res.status(201).json({message:"Alumno creado correctamente",data}); } catch(error) { return fail(res,error,"crear"); } },
    getAll: async (req,res) => { try { const data=await populate(Model.find()); return res.status(200).json({message:"Registros de alumno obtenidos correctamente",data}); } catch(error) { return fail(res,error,"obtener"); } },
    getById: async (req,res) => { try { const {id}=req.params; if(!mongoose.isValidObjectId(id)) return res.status(400).json({message:"El identificador no es válido"}); const data=await populate(Model.findById(id)); if(!data) return res.status(404).json({message:"Alumno no encontrado"}); return res.status(200).json({message:"Alumno obtenido correctamente",data}); } catch(error) { return fail(res,error,"obtener"); } },
    update: async (req,res) => { try { const {id}=req.params; if(!mongoose.isValidObjectId(id)) return res.status(400).json({message:"El identificador no es válido"}); const existing=await Model.findById(id); if(!existing) return res.status(404).json({message:"Alumno no encontrado"}); const issue=await checkReferences(req.body); if(issue) return res.status(400).json({message:issue}); const data=await populate(Model.findByIdAndUpdate(id,req.body,{new:true,runValidators:true})); return res.status(200).json({message:"Alumno actualizado correctamente",data}); } catch(error) { return fail(res,error,"actualizar"); } },
    remove: async (req,res) => { try { const {id}=req.params; if(!mongoose.isValidObjectId(id)) return res.status(400).json({message:"El identificador no es válido"}); const data=await Model.findByIdAndDelete(id); if(!data) return res.status(404).json({message:"Alumno no encontrado"}); return res.status(200).json({message:"Alumno eliminado correctamente"}); } catch(error) { return fail(res,error,"eliminar"); } }
  };
};

const handlers = createHandlers();
module.exports = { createStudent: handlers.create, getStudents: handlers.getAll, getStudentById: handlers.getById, updateStudent: handlers.update, deleteStudent: handlers.remove };
