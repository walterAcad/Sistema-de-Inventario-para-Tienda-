const Category = require("../models/category");

// CREATE
exports.createCategory = async (req, res, next) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

// READ
exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id).populate(
      "parentCategory"
    );
    if (!category)
      return res.status(404).json({ message: "Categoría no encontrada" });
    res.json(category);
  } catch (err) {
    next(err);
  }
};

// UPDATE
exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!category)
      return res.status(404).json({ message: "Categoría no encontrada" });
    res.json(category);
  } catch (err) {
    next(err);
  }
};

// DELETE (lógico)
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    res.json({ message: "Categoría desactivada", category });
  } catch (err) {
    next(err);
  }
};

// LIST
exports.listCategories = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, active } = req.query;
    const filter = active ? { isActive: active === "true" } : {};
    const categories = await Category.find(filter)
      .populate("parentCategory")
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json(categories);
  } catch (err) {
    next(err);
  }
};
