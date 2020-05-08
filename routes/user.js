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
/**
 * @swagger
 * /users/login:
 *   post:
 *     tags:
 *       - User
 *     name: Login
 *     summary: Logs in a user
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           $ref: '#/definitions/User'
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *               format: password
 *         required:
 *           - email
 *           - password
 *     responses:
 *       '200':
 *         description: User found and logged in successfully
 *       '401':
 *         description: Sorry no user with such Email found
 *       '403':
 *         description: Email and password is incorrect
 */
router.post('/users/login', UserController.userLogin);
// fetch all users
router.get('/users', UserController.fetchUsers);
// get specific user info
router.get('/users/:userId', UserController.fetchSingleUser);
// search for user
router.post('/user/search', UserController.searchExistingUser);


module.exports = router;