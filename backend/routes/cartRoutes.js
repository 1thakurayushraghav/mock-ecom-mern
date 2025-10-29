import express from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const router = express.Router();

// 🔹 GET /api/cart
router.get("/", async (req, res) => {
  const user = "mockUser";
  const cart = await Cart.findOne({ user }).populate("items.productId");
  if (!cart) return res.json({ items: [], total: 0 });

  const total = cart.items.reduce(
    (sum, i) => sum + i.productId.price * i.qty,
    0
  );
  res.json({
    items: cart.items.map((i) => ({
      _id: i._id,
      name: i.productId.name,
      price: i.productId.price,
      qty: i.qty,
    })),
    total,
  });
});

// 🔹 POST /api/cart  { productId, qty }
router.post("/", async (req, res) => {
  const { productId, qty } = req.body;
  const user = "mockUser";

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ error: "Product not found" });

  let cart = await Cart.findOne({ user });
  if (!cart) cart = new Cart({ user, items: [] });

  const existing = cart.items.find((i) => i.productId.equals(productId));
  if (existing) {
    existing.qty += qty;
  } else {
    cart.items.push({ productId, qty });
  }

  await cart.save();
  res.json({ success: true });
});

// 🔹 DELETE /api/cart/:id (remove item)
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const user = "mockUser";

  const cart = await Cart.findOne({ user });
  if (!cart) return res.status(404).json({ error: "Cart not found" });

  cart.items = cart.items.filter((i) => i._id.toString() !== id);
  await cart.save();

  res.json({ success: true });
});

export default router;
