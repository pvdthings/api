const { mapLoan } = require('./maps');
const Loans = require('./loans');

module.exports = {
  mapLoan,
  ...Loans
};