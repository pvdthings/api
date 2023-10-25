const { fetchCategories, fetchThings, fetchThing, createThing, updateThing, deleteThingImage, updateThingCategories } = require('../../../services/inventory');

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
    const { name, spanishName, hidden, image } = req.body;

    try {
        await updateThing(id, { name, spanishName, hidden, image });
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).send({ errors: [error] });
    }
});

router.patch('/:id/categories', async (req, res) => {
    const { id } = req.params;
    const { categories } = req.body;

    try {
        await updateThingCategories(id, { categories });
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
});

router.delete('/:id/image', async (req, res) => {
    const { id } = req.params;

    try {
        res.send(await deleteThingImage(id));
    } catch (error) {
        console.error(error);
        res.status(500).send({ errors: [error] });
    }
});

module.exports = router;