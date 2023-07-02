const { fetchInventory, fetchInventoryItem, createInventoryItems } = require('../../services/inventory');

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
    const { thingId, quantity, brand, description, estimatedValue } = req.body;

    try {
        res.send(await createInventoryItems(thingId, { quantity, brand, description, estimatedValue }));
    } catch (error) {
        console.error(error);
        res.status(500).send({ errors: [error] });
    }
});

module.exports = router;