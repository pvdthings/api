const { fetchCategories, fetchThings, fetchThing, createThing, updateThing } = require('../../services/inventory');

const express = require('express');
const router = express.Router();

router.get('/categories', async (req, res) => {
    res.send(fetchCategories());
});

router.get('/', async (req, res) => {
    res.send(await fetchThings());
});

router.get('/:id', async (req, res) => {
    try {
        res.send(await fetchThing({ id: req.params.id }));
    } catch (error) {
        console.error(error);
        res.status(404).send({ errors: [error] });
    }
});

router.put('/', async (req, res) => {
    const { name, spanishName } = req.body;

    try {
        res.send(await createThing({ name, spanishName }));
    } catch (error) {
        console.error(error);
        res.status(500).send({ errors: [error] });
    }
});

router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, spanishName, hidden } = req.body;

    try {
        res.send(await updateThing(id, { name, spanishName, hidden }));
    } catch (error) {
        console.error(error);
        res.status(500).send({ errors: [error] });
    }
});

module.exports = router;