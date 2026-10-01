const mongoose = require("mongoose");

// Conecta la aplicación con MongoDB Atlas usando la URI del entorno.
const connectDatabase = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("La variable MONGODB_URI no está configurada");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Conexión con MongoDB establecida");
};

module.exports = connectDatabase;
