const Product = require('../models/Product');

const getAll = async (req, res) => {
  const products = await Product.findAll();
  res.json(products);
};

const getOne = async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

const create = async (req, res) => {
  const { name, description, price, stock, image } = req.body;
  if (!name || !price) return res.status(400).json({ message: 'Name and price are required' });
  const product = await Product.create({ name, description, price, stock, image });
  res.status(201).json(product);
};
if (price === undefined || price === null || typeof price !== "number" || Number.isNaN(price)) {
      return res.status(400).json({
        message: "Le prix doit être un nombre valide"
      });
    }
if (price < 0) {
      return res.status(400).json({
        message: "Le prix doit être supérieur à 0"
      });
    }

const update = async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  await product.update(req.body);
  res.json(product);
};

const remove = async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  await product.destroy();
  res.json({ message: 'Product deleted' });
};

module.exports = { getAll, getOne, create, update, remove };
