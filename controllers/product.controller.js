const Product = require("../models/Product");

// CREATE
exports.createProduct = async (req, res, next) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

// READ
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product)
      return res.status(404).json({ message: "Producto no encontrado" });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// UPDATE
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// DELETE (físico o lógico)
exports.deleteProduct = async (req, res, next) => {
  try {
    const logical = req.query.logical === "true";
    if (logical) {
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        { isAvailable: false },
        { new: true }
      );
      return res.json({ message: "Producto desactivado", product });
    } else {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: "Producto eliminado físicamente" });
    }
  } catch (err) {
    next(err);
  }
};

// LIST con filtros, búsqueda y orden
exports.listProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "name",
      order = "asc",
      category,
      minPrice,
      maxPrice,
      text,
    } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
    if (text) filter.$text = { $search: text };

    const products = await Product.find(filter)
      .populate("category")
      .sort({ [sort]: order === "desc" ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json(products);
  } catch (err) {
    next(err);
  }
};
