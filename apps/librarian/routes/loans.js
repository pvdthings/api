const { fetchLoans, fetchLoan, createLoan, updateLoan, updateDueDates } = require('../../../services/loans');
const authorizeAdminUser = require('../../../middleware/adminAuthorization');

const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const includeClosedLoans = req.query['closed'];
    res.send(await fetchLoans({ includeClosed: includeClosedLoans }));
});

router.get('/:loanId/:thingId', async (req, res) => {
    const loan = await fetchLoan({ loanId: req.params.loanId, thingId: req.params.thingId });
    if (loan) {
        res.send(loan);
    } else {
        res.status(404).send();
    }
});

router.put('/', async (req, res) => {
    try {
        const newLoanId = await createLoan(req.body);
        res.status(201).send({ id: newLoanId });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error });
    }
});

router.patch('/:loanId/:thingId', async (req, res) => {
    const { notes, dueBackDate, checkedInDate } = req.body;
    try {
        await updateLoan({
            loanId: req.params.loanId,
            thingId: req.params.thingId,
            notes,
            dueBackDate,
            checkedInDate
        });
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).send({ error });
    }
});

router.head('/extend', authorizeAdminUser, async (req, res) => {
    res.status(204).send();
});

router.post('/extend', authorizeAdminUser, async (req, res) => {
    const { dueDate } = req.body;
    try {
        const success = await updateDueDates({ dueDate });
        res.status(200).send({ success });
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).send({ error });
    }
});

module.exports = router;