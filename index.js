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

// Importar rutas
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

// Usar rutas
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

app.get("/", (req, res) => {
  res.send("Sistema de Inventario - API funcionando");
});

// Importar middlewares de error
const { notFound, globalErrorHandler } = require('./middlewares/errorHandler');

// Middleware para rutas no encontradas
app.use(notFound);

// Middleware global de manejo de errores
app.use(globalErrorHandler);

// Iniciar el servidor Express
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
