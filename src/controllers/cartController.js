const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getCart = async (req, res) => {
  const { userId } = req.params;
  const items = await Cart.findAll({
    where: { userId },
    include: [{ model: Product }],
  });
  res.json(items);
};

const addToCart = async (req, res) => {
  const { userId, productId, quantity = 1 } = req.body;

  const product = await Product.findByPk(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const [item, created] = await Cart.findOrCreate({
    where: { userId, productId },
    defaults: { quantity },
  });

  if (!created) {
    await item.update({ quantity: item.quantity + quantity });
  }

  res.status(created ? 201 : 200).json(item);
};

const updateCartItem = async (req, res) => {
  const item = await Cart.findByPk(req.params.id);
  if (!item) return res.status(404).json({ message: 'Cart item not found' });
  await item.update({ quantity: req.body.quantity });
  res.json(item);
};

const removeFromCart = async (req, res) => {
  const item = await Cart.findByPk(req.params.id);
  if (!item) return res.status(404).json({ message: 'Cart item not found' });
  await item.destroy();
  res.json({ message: 'Item removed from cart' });
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart };
