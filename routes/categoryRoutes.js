const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { 
  validateCategory,
  validateCategoryUpdate,
  validateMongoId,
  validateCategoryQuery,
  handleValidationErrors 
} = require('../middlewares/validation');

router.get('/', 
  validateCategoryQuery,
  handleValidationErrors,
  categoryController.getCategories
);

router.post('/', 
  validateCategory,
  handleValidationErrors,
  categoryController.createCategory
);

router.get('/:id', 
  validateMongoId,
  handleValidationErrors,
  categoryController.getCategoryById
);

router.put('/:id', 
  validateMongoId,
  validateCategoryUpdate,
  handleValidationErrors,
  categoryController.updateCategory
);

router.delete('/:id', 
  validateMongoId,
  handleValidationErrors,
  categoryController.deleteCategory
);

module.exports = router;
