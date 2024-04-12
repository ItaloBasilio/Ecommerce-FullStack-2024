const express = require('express');
const { createUser, loginUserControl, getAllUser } = require('../controller/userController');
const router = express.Router();



router.post('/register', createUser);
router.post('/login', loginUserControl);
router.get('/all-users', getAllUser);
module.exports = router;