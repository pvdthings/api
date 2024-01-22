const { sendLoanReminder } = require('../../../services/messages');

const express = require('express');
const router = express.Router();

router.post('/loan-reminder', async (req, res) => {
  const { loanNumber } = req.body;

  try {
    const success = await sendLoanReminder({ loanNumber });
    res.status(202).send({ success });
  } catch (error) {
    console.error(error);
    res.status(error.status).send({ errors: [error] })
  }
});

module.exports = router;