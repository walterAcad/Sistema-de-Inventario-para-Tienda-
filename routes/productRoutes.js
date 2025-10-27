const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { 
  validateProduct, 
  validateProductUpdate,
  validateMongoId,
  validateProductQuery,
  handleValidationErrors 
} = require('../middlewares/validation');

router.get('/', 
  validateProductQuery,
  handleValidationErrors,
  productController.getProducts
);

router.post('/', 
  validateProduct,
  handleValidationErrors,
  productController.createProduct
);

router.get('/:id', 
  validateMongoId,
  handleValidationErrors,
  productController.getProductById
);

router.put('/:id', 
  validateMongoId,
  validateProductUpdate,
  handleValidationErrors,
  productController.updateProduct
);

router.delete('/:id', 
  validateMongoId,
  handleValidationErrors,
  productController.deleteProduct
);

module.exports = router;
