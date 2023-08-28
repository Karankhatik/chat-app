const express = require('express');
const router = express.Router();
const authenticate = require('../config/jwtAuthentication');
const messageController = require('../controllers/message')

//user routes

router.get('/get-messages', authenticate ,messageController.getMessage);
module.exports = router;