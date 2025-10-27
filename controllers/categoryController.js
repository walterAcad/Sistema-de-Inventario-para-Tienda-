const Category = require('../models/Category');

// Obtener categorías con FILTRADO MÚLTIPLE, POPULATE y ORDENAMIENTO
exports.getCategories = async (req, res) => {
  try {
    const { name, isActive, sortBy = 'name', order = 'asc' } = req.query;

    // FILTRADO POR MÚLTIPLES CRITERIOS
    const filters = {};
    
    if (name) {
      filters.name = { $regex: name, $options: 'i' };
    }
    
    if (isActive !== undefined) {
      filters.isActive = isActive === 'true';
    }

    // ORDENAMIENTO POR DIFERENTES CAMPOS
    const sort = {};
    sort[sortBy] = order === 'asc' ? 1 : -1;

    // POPULATE DE REFERENCIAS (parentCategory)
    const categories = await Category.find(filters)
      .populate('parentCategory', 'name description')
      .sort(sort);

    res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener categorías',
      error: error.message
    });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    const categoryWithParent = await Category.findById(category._id)
      .populate('parentCategory');
    
    res.status(201).json({
      success: true,
      data: categoryWithParent
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear categoría',
      error: error.message
    });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('parentCategory');
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener categoría',
      error: error.message
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('parentCategory');
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar categoría',
      error: error.message
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }
    
    res.json({
      success: true,
      message: 'Categoría eliminada correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar categoría',
      error: error.message
    });
  }
};
