const express = require('express');
const transactionControllers = require('../controllers/transaction');
const authControllers = require('../controllers/auth');

const { tokenValid, requireSignIn, hasAuthorization, confirmUser } = authControllers;
const { transferMoney, getAllTransactions, getDebitsForUser, getCreditsForUser } = transactionControllers;
const router = express.Router()

router.post('/transfer', confirmUser,  requireSignIn, tokenValid, hasAuthorization, transferMoney);

router.post('/userDebits', confirmUser,  requireSignIn, tokenValid, hasAuthorization, getDebitsForUser);

router.post('/userCredits', confirmUser,  requireSignIn, tokenValid, hasAuthorization,  getCreditsForUser);

router.get('/transactions', getAllTransactions );

module.exports = router;