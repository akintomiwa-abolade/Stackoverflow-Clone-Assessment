/**
|----------------------------------
| User Api Route
|----------------------------------
*/

const express = require("express");
const router = express.Router();
require('dotenv').config();
const UserController = require('../controllers/UserController');

// register user
router.post('/users/register', UserController.registerUser);
// user login
router.post('/users/login', UserController.userLogin);
// fetch all users
router.get('/users', UserController.fetchUsers);
// get specific user info
router.get('/users/:userId', UserController.fetchSingleUser);
// search for user
router.post('/user/search', UserController.searchExistingUser);


module.exports = router;