const { fetchInventory, fetchInventoryItem, createInventoryItems, updateInventoryItem, deleteInventoryItem } = require('../../../services/inventory');

const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    res.send(await fetchInventory());
});

router.get('/:id', async (req, res) => {
    try {
        res.send(await fetchInventoryItem({ id: req.params.id }));
    } catch (error) {
        res.status(404).send({ errors: [error] });
    }
});

router.put('/', async (req, res) => {
    const { thingId, quantity, brand, condition, description, estimatedValue, hidden, image } = req.body;

    try {
        res.send(await createInventoryItems(thingId, { quantity, brand, condition, description, estimatedValue, hidden, image }));
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).send({ errors: [error] });
    }
});

router.patch('/:id', async (req, res) => {
    const { brand, description, estimatedValue, hidden, condition, image } = req.body;

    try {
        await updateInventoryItem(req.params.id, { brand, description, estimatedValue, hidden, condition, image });
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await deleteInventoryItem(id);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).send();
    }
});

module.exports = router;