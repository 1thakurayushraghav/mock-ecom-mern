import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  qty: { type: Number, default: 1 },
});

const cartSchema = new mongoose.Schema({
  user: { type: String, default: "mockUser" }, // single mock user
  items: [cartItemSchema],
});

export default mongoose.model("Cart", cartSchema);
