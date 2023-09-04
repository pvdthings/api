const { fetchBorrowers, fetchBorrower } = require('../../../services/borrowers');

const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    res.send(await fetchBorrowers());
});

router.get('/:id', async (req, res) => {
    res.send(await fetchBorrower({ id: req.params.id }));
});

module.exports = router;