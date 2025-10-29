import express from "express";
import Cart from "../models/Cart.js";
const router = express.Router();

// POST /api/checkout  { name, email }
router.post("/", async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email)
    return res.status(400).json({ error: "Name and email required" });

  const user = "mockUser";
  const cart = await Cart.findOne({ user }).populate("items.productId");
  if (!cart || cart.items.length === 0)
    return res.status(400).json({ error: "Cart is empty" });

  const total = cart.items.reduce(
    (sum, i) => sum + i.productId.price * i.qty,
    0
  );

  const receipt = {
    id: Math.random().toString(36).slice(2, 8),
    name,
    email,
    total,
    items: cart.items.map((i) => ({
      name: i.productId.name,
      qty: i.qty,
      price: i.productId.price,
    })),
    timestamp: new Date().toISOString(),
  };

  // Clear cart after checkout
  await Cart.findOneAndUpdate({ user }, { items: [] });

  res.json({ success: true, receipt });
});

export default router;
