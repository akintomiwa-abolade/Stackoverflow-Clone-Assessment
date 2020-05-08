/**
|----------------------------------
| User Api Route
|----------------------------------
*/

const express = require("express");
const router = express.Router();
require('dotenv').config();
const UserController = require('../controllers/UserController');

// register users
router.post('/users/register', UserController.registerUser);
// user logins
router.post('/users/login', UserController.userLogin);
// fetch all users
router.get('/users', UserController.fetchUsers);
// get specific user info
router.get('/users/:userId', UserController.fetchSingleUser);
// search for user
router.post('/user/search', UserController.searchExistingUser);


module.exports = router;