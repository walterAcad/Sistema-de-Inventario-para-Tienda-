const { body, param, query, validationResult } = require('express-validator');

// Middleware para manejar errores de validación
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

// Validaciones para productos
exports.validateProduct = [
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('La descripción es obligatoria')
    .isLength({ min: 10 }).withMessage('La descripción debe tener al menos 10 caracteres'),
  
  body('price')
    .isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo')
    .notEmpty().withMessage('El precio es obligatorio'),
  
  body('comparePrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('El precio de comparación debe ser un número positivo'),
  
  body('sku')
    .trim()
    .notEmpty().withMessage('El SKU es obligatorio')
    .isLength({ min: 3, max: 20 }).withMessage('El SKU debe tener entre 3 y 20 caracteres')
    .matches(/^[A-Z0-9-]+$/i).withMessage('El SKU solo puede contener letras, números y guiones'),
  
  body('stock')
    .isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo')
    .notEmpty().withMessage('El stock es obligatorio'),
  
  body('category')
    .notEmpty().withMessage('La categoría es obligatoria')
    .isMongoId().withMessage('ID de categoría inválido'),
  
  body('images')
    .optional()
    .isArray().withMessage('Las imágenes deben ser un array'),
  
  body('images.*')
    .optional()
    .isURL().withMessage('Cada imagen debe ser una URL válida'),
  
  body('isAvailable')
    .optional()
    .isBoolean().withMessage('isAvailable debe ser true o false'),
  
  body('supplier.name')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('El nombre del proveedor debe tener al menos 2 caracteres'),
  
  body('supplier.contact')
    .optional()
    .trim()
];

// Validaciones para actualizar producto (campos opcionales)
exports.validateProductUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10 }).withMessage('La descripción debe tener al menos 10 caracteres'),
  
  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
  
  body('comparePrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('El precio de comparación debe ser un número positivo'),
  
  body('sku')
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 }).withMessage('El SKU debe tener entre 3 y 20 caracteres')
    .matches(/^[A-Z0-9-]+$/i).withMessage('El SKU solo puede contener letras, números y guiones'),
  
  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo'),
  
  body('category')
    .optional()
    .isMongoId().withMessage('ID de categoría inválido'),
  
  body('images')
    .optional()
    .isArray().withMessage('Las imágenes deben ser un array'),
  
  body('images.*')
    .optional()
    .isURL().withMessage('Cada imagen debe ser una URL válida'),
  
  body('isAvailable')
    .optional()
    .isBoolean().withMessage('isAvailable debe ser true o false')
];

// Validaciones para categorías
exports.validateCategory = [
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  
  body('description')
    .optional()
    .trim(),
  
  body('parentCategory')
    .optional()
    .isMongoId().withMessage('ID de categoría padre inválido'),
  
  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive debe ser true o false')
];

// Validaciones para actualizar categoría
exports.validateCategoryUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  
  body('description')
    .optional()
    .trim(),
  
  body('parentCategory')
    .optional()
    .isMongoId().withMessage('ID de categoría padre inválido'),
  
  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive debe ser true o false')
];

// Validación de ID de MongoDB
exports.validateMongoId = [
  param('id')
    .isMongoId().withMessage('ID inválido')
];

// Validaciones para query params de filtrado de productos
exports.validateProductQuery = [
  query('priceMin')
    .optional()
    .isFloat({ min: 0 }).withMessage('priceMin debe ser un número positivo'),
  
  query('priceMax')
    .optional()
    .isFloat({ min: 0 }).withMessage('priceMax debe ser un número positivo'),
  
  query('stockMin')
    .optional()
    .isInt({ min: 0 }).withMessage('stockMin debe ser un número entero positivo'),
  
  query('stockMax')
    .optional()
    .isInt({ min: 0 }).withMessage('stockMax debe ser un número entero positivo'),
  
  query('category')
    .optional()
    .isMongoId().withMessage('ID de categoría inválido'),
  
  query('isAvailable')
    .optional()
    .isIn(['true', 'false']).withMessage('isAvailable debe ser true o false'),
  
  query('sortBy')
    .optional()
    .isIn(['name', 'price', 'stock', 'createdAt', 'updatedAt'])
    .withMessage('sortBy debe ser: name, price, stock, createdAt o updatedAt'),
  
  query('order')
    .optional()
    .isIn(['asc', 'desc']).withMessage('order debe ser asc o desc')
];

// Validaciones para query params de filtrado de categorías
exports.validateCategoryQuery = [
  query('isActive')
    .optional()
    .isIn(['true', 'false']).withMessage('isActive debe ser true o false'),
  
  query('sortBy')
    .optional()
    .isIn(['name', 'createdAt', 'updatedAt'])
    .withMessage('sortBy debe ser: name, createdAt o updatedAt'),
  
  query('order')
    .optional()
    .isIn(['asc', 'desc']).withMessage('order debe ser asc o desc')
];
