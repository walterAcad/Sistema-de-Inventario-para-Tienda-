const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

const DB_URI =
  "mongodb+srv://walteramacademico_db_user:conectdatabase@cluster0.5alf9lx.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(DB_URI)
  .then(() => console.log("¡Conexión exitosa a MongoDB!"))
  .catch((err) => console.error("Error al conectar a MongoDB:", err));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("prueba conexion");
});

app.use((req, res, next) => {
  const error = new Error(`No se encontró la ruta: ${req.originalUrl}`);
  error.status = 404;
  next(error);
});

// Middleware de manejo de errores general (4 argumentos)
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    error: {
      message: err.message || "Error interno del servidor.",
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    },
  });
});

// Iniciar el servidor Express
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
