const Product = require('../models/Product');

// LIST - Obtener productos con FILTRADO MÚLTIPLE, POPULATE, ORDENAMIENTO y PAGINACIÓN
exports.getProducts = async (req, res) => {
  try {
    const { 
      name, 
      priceMin, 
      priceMax, 
      stockMin, 
      stockMax,
      category,
      sku,
      isAvailable,
      supplierName,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10,
      text
    } = req.query;

    // FILTRADO POR MÚLTIPLES CRITERIOS
    const filters = {};

    if (name) {
      filters.name = { $regex: name, $options: 'i' };
    }

    if (priceMin || priceMax) {
      filters.price = {};
      if (priceMin) filters.price.$gte = Number(priceMin);
      if (priceMax) filters.price.$lte = Number(priceMax);
    }

    if (stockMin || stockMax) {
      filters.stock = {};
      if (stockMin) filters.stock.$gte = Number(stockMin);
      if (stockMax) filters.stock.$lte = Number(stockMax);
    }

    if (category) {
      filters.category = category;
    }

    if (sku) {
      filters.sku = sku.toUpperCase();
    }

    if (isAvailable !== undefined) {
      filters.isAvailable = isAvailable === 'true';
    }

    if (supplierName) {
      filters['supplier.name'] = { $regex: supplierName, $options: 'i' };
    }

    if (text) {
      filters.$text = { $search: text };
    }

    // ORDENAMIENTO POR DIFERENTES CAMPOS
    const sort = {};
    sort[sortBy] = order === 'asc' ? 1 : -1;

    // POPULATE DE REFERENCIAS (category con parentCategory anidado)
    const products = await Product.find(filters)
      .populate({
        path: 'category',
        select: 'name description isActive',
        populate: {
          path: 'parentCategory',
          select: 'name description'
        }
      })
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Product.countDocuments(filters);

    res.json({
      success: true,
      count: products.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener productos',
      error: error.message
    });
  }
};

// Alias para compatibilidad
exports.listProducts = exports.getProducts;

// CREATE - Crear nuevo producto
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    await product.populate({
      path: 'category',
      populate: { path: 'parentCategory' }
    });

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear producto',
      error: error.message
    });
  }
};

// READ - Obtener producto por ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate({
        path: 'category',
        populate: { path: 'parentCategory' }
      });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener producto',
      error: error.message
    });
  }
};

// UPDATE - Actualizar producto
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate({
      path: 'category',
      populate: { path: 'parentCategory' }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar producto',
      error: error.message
    });
  }
};

// DELETE - Eliminar producto (físico o lógico)
exports.deleteProduct = async (req, res) => {
  try {
    const logical = req.query.logical === 'true';
    
    if (logical) {
      // Eliminación lógica (desactivar)
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        { isAvailable: false },
        { new: true }
      );
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Producto no encontrado'
        });
      }
      
      return res.json({
        success: true,
        message: 'Producto desactivado',
        data: product
      });
    } else {
      // Eliminación física
      const product = await Product.findByIdAndDelete(req.params.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Producto no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Producto eliminado físicamente'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar producto',
      error: error.message
    });
  }
};
