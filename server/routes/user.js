const express = require('express');
const router = express.Router();

const usersController = require('../controllers/user');

//user routes
router.post('/register', usersController.register);
router.post('/login',usersController.login);
router.get('/get-users',usersController.getUsers);


module.exports = router;