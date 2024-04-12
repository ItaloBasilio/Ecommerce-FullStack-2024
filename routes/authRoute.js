const express = require('express');
const { createUser, loginUserControl, getAllUser, getUser, deleteUser, updateUser } = require('../controller/userController');
const router = express.Router();



router.post('/register', createUser);
router.post('/login', loginUserControl);
router.get('/all-users', getAllUser);
router.get('/:id', getUser);
router.delete('/:id', deleteUser );
router.put('/:id', updateUser );

module.exports = router;