const Category = require('../models/Category');

// LIST - Obtener categorías con FILTRADO MÚLTIPLE, POPULATE, ORDENAMIENTO y PAGINACIÓN
exports.getCategories = async (req, res) => {
  try {
    const { 
      name, 
      isActive, 
      sortBy = 'name', 
      order = 'asc',
      page = 1,
      limit = 10
    } = req.query;

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
      .populate('parentCategory', 'name description isActive')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Category.countDocuments(filters);

    res.json({
      success: true,
      count: categories.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
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

// Alias para compatibilidad
exports.listCategories = exports.getCategories;

// CREATE - Crear nueva categoría
exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    await category.populate('parentCategory');
    
    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear categoría',
      error: error.message
    });
  }
};

// READ - Obtener categoría por ID
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

// UPDATE - Actualizar categoría
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

// DELETE - Eliminar categoría (físico o lógico)
exports.deleteCategory = async (req, res) => {
  try {
    const logical = req.query.logical === 'true';
    
    if (logical) {
      // Eliminación lógica (desactivar)
      const category = await Category.findByIdAndUpdate(
        req.params.id,
        { isActive: false },
        { new: true }
      );
      
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Categoría no encontrada'
        });
      }
      
      return res.json({
        success: true,
        message: 'Categoría desactivada',
        data: category
      });
    } else {
      // Eliminación física
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
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar categoría',
      error: error.message
    });
  }
};
