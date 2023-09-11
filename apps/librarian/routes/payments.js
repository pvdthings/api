const { recordCashPayment } = require('../../../services/payments');

const express = require('express');
const router = express.Router();

router.put('/:borrowerId', async (req, res) => {
    const { borrowerId } = req.params;
    const { cash } = req.body;
    try {
        const paymentId = await recordCashPayment({ borrowerId, cash });
        res.status(201).send({ id: paymentId });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error });
    }
});

module.exports = router;