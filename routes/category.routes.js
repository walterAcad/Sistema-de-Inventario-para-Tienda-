const express = require("express");
const router = express.Router();
const controller = require("../controllers/category.controller");

router.post("/", controller.createCategory);
router.get("/:id", controller.getCategoryById);
router.put("/:id", controller.updateCategory);
router.delete("/:id", controller.deleteCategory);
router.get("/", controller.listCategories);

module.exports = router;
