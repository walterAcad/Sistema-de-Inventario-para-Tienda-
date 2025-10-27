const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, "El precio no puede ser negativo"],
    },
    comparePrice: {
      type: Number,
      min: 0,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    images: [String],
    specifications: {
      type: Map,
      of: String,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    supplier: {
      name: String,
      contact: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
