const Product = require('../models/Product');

// Obtener productos con FILTRADO MÚLTIPLE, POPULATE y ORDENAMIENTO
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
      order = 'desc'
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
      .sort(sort);

    res.json({
      success: true,
      count: products.length,
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

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    const productWithCategory = await Product.findById(product._id)
      .populate({
        path: 'category',
        populate: { path: 'parentCategory' }
      });

    res.status(201).json({
      success: true,
      data: productWithCategory
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear producto',
      error: error.message
    });
  }
};

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

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Producto eliminado correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar producto',
      error: error.message
    });
  }
};
