// Clase de error personalizada
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Manejo de errores de Cast de MongoDB (ID inválido)
const handleCastErrorDB = (err) => {
  const message = `Valor inválido: ${err.path} = ${err.value}`;
  return new AppError(message, 400);
};

// Manejo de errores de duplicados de MongoDB
const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `El valor '${value}' ya existe para el campo '${field}'. Por favor use otro valor.`;
  return new AppError(message, 400);
};

// Manejo de errores de validación de MongoDB
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Datos de entrada inválidos: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// Enviar error en desarrollo
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack
  });
};

// Enviar error en producción
const sendErrorProd = (err, res) => {
  // Error operacional, confiable: enviar mensaje al cliente
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message
    });
  } 
  // Error de programación u otro error desconocido: no filtrar detalles
  else {
    console.error('ERROR:', err);
    res.status(500).json({
      success: false,
      status: 'error',
      message: 'Algo salió muy mal!'
    });
  }
};

// Middleware global de manejo de errores
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    // Errores específicos de MongoDB
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);

    sendErrorProd(error, res);
  } else {
    // Por defecto, modo desarrollo
    sendErrorDev(err, res);
  }
};

// Middleware para rutas no encontradas
const notFound = (req, res, next) => {
  const error = new AppError(`No se puede encontrar ${req.originalUrl} en este servidor`, 404);
  next(error);
};

// Wrapper para async/await (evita try-catch en cada controlador)
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = {
  AppError,
  globalErrorHandler,
  notFound,
  catchAsync
};
