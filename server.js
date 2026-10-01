require("dotenv").config();

const app = require("./src/app");
const connectDatabase = require("./src/config/database");

const port = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(port, () => {
      console.log(`Servidor activo en el puerto ${port}`);
    });
  } catch (error) {
    console.error("No fue posible iniciar el servidor:", error.message);
    process.exit(1);
  }
};

startServer();
