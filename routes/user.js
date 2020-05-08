/**
|----------------------------------
| User Api Route
|----------------------------------
*/

const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticate, authorize } = require('../middlewares/auth');
require('dotenv').config();
const secret = process.env.SECRET;
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