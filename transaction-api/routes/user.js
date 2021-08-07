const express = require('express');
const authControllers = require('../controllers/auth');

const { signIn, signUp, isUserNameTaken, getUsers } = authControllers;
const router = express.Router()

router.get('/users', getUsers);
router.post('/register', isUserNameTaken, signUp);
router.post('/login', signIn)

module.exports = router;