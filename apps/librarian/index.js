const express = require('express');
const router = express.Router();
const authentication = require('../../middleware/supabaseAuthentication');
const thingsEndpoint = require('./routes/things');
const inventoryEndpoint = require('./routes/inventory');
const borrowersEndpoint = require('./routes/borrowers');
const loansEndpoint = require('./routes/loans');
const paymentsEndpoint = require('./routes/payments');

router.use(authentication);
router.use('/things', thingsEndpoint);
router.use('/inventory', inventoryEndpoint);
router.use('/borrowers', borrowersEndpoint);
router.use('/loans', loansEndpoint);
router.use('/payments', paymentsEndpoint);

module.exports = router;
