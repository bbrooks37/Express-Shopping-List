const express = require('express');
const router = new express.Router();
const DataStore = require('../dataStore');
const ExpressError = require('../expressError');

router.get('/', (req, res, next) => {
  const items = DataStore.getAll();
  return res.json(items);
});

router.post('/', (req, res, next) => {
  try {
    const { name, price } = req.body;
    if (!name || price === undefined) {
      throw new ExpressError("Name and price are required", 400);
    }
    const newItem = { name, price };
    DataStore.addItem(newItem);
    return res.status(201).json({ added: newItem });
  } catch (err) {
    return next(err);
  }
});

router.get('/:name', (req, res, next) => {
  try {
    const item = DataStore.getItem(req.params.name);
    if (!item) {
      throw new ExpressError("Item not found", 404);
    }
    return res.json(item);
  } catch (err) {
    return next(err);
  }
});

router.patch('/:name', (req, res, next) => {
  try {
    const { name, price } = req.body;
    if (!name || price === undefined) {
      throw new ExpressError("Name and price are required", 400);
    }
    const updatedItem = { name, price };
    const item = DataStore.updateItem(req.params.name, updatedItem);
    if (!item) {
      throw new ExpressError("Item not found", 404);
    }
    return res.json({ updated: item });
  } catch (err) {
    return next(err);
  }
});

router.delete('/:name', (req, res, next) => {
  try {
    const item = DataStore.deleteItem(req.params.name);
    if (!item) {
      throw new ExpressError("Item not found", 404);
    }
    return res.json({ message: "Deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
