const Categoria = require('../models/Categoria');

exports.obtenerCategorias = async (req, res) => {
  try {
    const { nombre, sortBy = 'nombre', order = 'asc' } = req.query;

    const filtros = {};
    if (nombre) {
      filtros.nombre = { $regex: nombre, $options: 'i' };
    }

    const ordenamiento = {};
    ordenamiento[sortBy] = order === 'asc' ? 1 : -1;

    const categorias = await Categoria.find(filtros).sort(ordenamiento);

    res.json({
      success: true,
      count: categorias.length,
      data: categorias
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener categorías',
      error: error.message
    });
  }
};

exports.crearCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.create(req.body);
    res.status(201).json({
      success: true,
      data: categoria
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear categoría',
      error: error.message
    });
  }
};

exports.obtenerCategoriaPorId = async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);
    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }
    res.json({
      success: true,
      data: categoria
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener categoría',
      error: error.message
    });
  }
};

exports.actualizarCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }
    res.json({
      success: true,
      data: categoria
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar categoría',
      error: error.message
    });
  }
};

exports.eliminarCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findByIdAndDelete(req.params.id);
    if (!categoria) {
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
