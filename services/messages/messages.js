const LOAN_REMINDER_WEBHOOK_URL = process.env.LOAN_REMINDER_WEBHOOK_URL;

async function sendLoanReminder({ loanNumber }) {
  const response = await fetch(LOAN_REMINDER_WEBHOOK_URL, {
    method: 'POST',
    body: {
      loanNumber
    }
  });

  const { success } = response.body;
  return success;
}

module.exports = {
  sendLoanReminder
};