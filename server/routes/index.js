const express = require('express');
const router = express.Router();

//common router
router.use('/user', require('./user'));
router.use('/message', require('./message'));


module.exports = router;