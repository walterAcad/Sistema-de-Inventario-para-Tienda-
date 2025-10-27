const express = require("express");
const router = express.Router();
const controller = require("../controllers/product.controller");

router.post("/", controller.createProduct);
router.get("/:id", controller.getProductById);
router.put("/:id", controller.updateProduct);
router.delete("/:id", controller.deleteProduct);
router.get("/", controller.listProducts);

module.exports = router;
