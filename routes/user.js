/**
|----------------------------------
| User Api Route
|----------------------------------
*/

const express = require("express");
const router = express.Router();
require('dotenv').config();
const UserController = require('../controllers/UserController');

/**
 * @swagger
 * /users/register:
 *   post:
 *     tags:
 *       - Users
 *     name: Register
 *     summary: Register a new user
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           $ref: '#/definitions/User'
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             password:
 *               type: string
 *               format: password
 *             fcm_token:
 *               type: string
 *         required:
 *           - name
 *           - email
 *           - password
 *           - fcm_token
 *     responses:
 *       '201':
 *         description: Registration Successful
 *       '403':
 *         description: User with this Email already exist
 */
router.post('/users/register', UserController.registerUser);
/**
 * @swagger
 * /users/login:
 *   post:
 *     tags:
 *       - Users
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
 *         description: Email and password is incorrect
 *       '403':
 *         description: Sorry no user with such Email found.
 */
router.post('/users/login', UserController.userLogin);
// fetch all users
router.get('/users', UserController.fetchUsers);
// get specific user info
router.get('/users/:userId', UserController.fetchSingleUser);
/**
 * @swagger
 * /api/v1/user/search:
 *   post:
 *     tags:
 *       - Users
 *     name: Search for user
 *     summary: Search user by name
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             search:
 *               type: string
 *         required:
 *           - search
 *     responses:
 *       '200':
 *         description: search user result array
 *       '500':
 *         description: Internal server error
 */
router.post('/user/search', UserController.searchExistingUser);


module.exports = router;