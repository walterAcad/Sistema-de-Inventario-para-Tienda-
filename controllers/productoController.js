const Producto = require('../models/Producto');

// Obtener productos con filtrado, populate y ordenamiento
exports.obtenerProductos = async (req, res) => {
  try {
    const { 
      nombre, 
      precioMin, 
      precioMax, 
      stockMin, 
      stockMax,
      categoria,
      proveedor,
      activo,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    // Construir objeto de filtros
    const filtros = {};

    if (nombre) {
      filtros.nombre = { $regex: nombre, $options: 'i' };
    }

    if (precioMin || precioMax) {
      filtros.precio = {};
      if (precioMin) filtros.precio.$gte = Number(precioMin);
      if (precioMax) filtros.precio.$lte = Number(precioMax);
    }

    if (stockMin || stockMax) {
      filtros.stock = {};
      if (stockMin) filtros.stock.$gte = Number(stockMin);
      if (stockMax) filtros.stock.$lte = Number(stockMax);
    }

    if (categoria) {
      filtros.categoria = categoria;
    }

    if (proveedor) {
      filtros.proveedor = proveedor;
    }

    if (activo !== undefined) {
      filtros.activo = activo === 'true';
    }

    // Construir ordenamiento
    const ordenamiento = {};
    ordenamiento[sortBy] = order === 'asc' ? 1 : -1;

    // Ejecutar consulta con populate
    const productos = await Producto.find(filtros)
      .populate('categoria', 'nombre descripcion')
      .populate('proveedor', 'nombre contacto telefono email')
      .sort(ordenamiento);

    res.json({
      success: true,
      count: productos.length,
      data: productos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener productos',
      error: error.message
    });
  }
};

// Crear producto
exports.crearProducto = async (req, res) => {
  try {
    const producto = await Producto.create(req.body);
    const productoPopulado = await Producto.findById(producto._id)
      .populate('categoria')
      .populate('proveedor');

    res.status(201).json({
      success: true,
      data: productoPopulado
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear producto',
      error: error.message
    });
  }
};

// Obtener producto por ID
exports.obtenerProductoPorId = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id)
      .populate('categoria')
      .populate('proveedor');

    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      data: producto
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener producto',
      error: error.message
    });
  }
};

// Actualizar producto
exports.actualizarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('categoria')
      .populate('proveedor');

    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      data: producto
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar producto',
      error: error.message
    });
  }
};

// Eliminar producto
exports.eliminarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);

    if (!producto) {
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
