/**
|----------------------------------
| Question Api Route
|----------------------------------
*/

const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const { authenticate, authorize } = require('../middlewares/auth');
const notificationServer = require('../middlewares/notificationServer');

const QuestionController = require('../controllers/QuestionController');

// view all question
router.get('/questions', QuestionController.fetchQuestions);
/**
 * @swagger
 * /questions:
 *   post:
 *     tags:
 *       - Users
 *     name: AskQuestion
 *     summary: User Ask Question
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
 *             title:
 *               type: string
 *             description:
 *               type: string
 *             user:
 *               type: integer
 *             upvote:
 *               type: ObjectId
 *         required:
 *           - title
 *           - description
 *     responses:
 *       '201':
 *         description: Question asked successfully
 */
router.post('/questions', authenticate, QuestionController.askQuestion);
// view all user questions
router.get('/questions/user', authenticate, QuestionController.fetchUsersQuestions);
// get single question
router.post('/questions/subscribe', authenticate, QuestionController.userSubscribeToQuestion)
// give question a up vote
router.put('/questions/:questionId/upvote', authenticate, QuestionController.upVoteQuestion);
// give question a down vote
router.put('/questions/:questionId/downvote', authenticate, QuestionController.downVoteQuestion);
// update question
router.put('/questions/:questionId', authenticate, authorize, QuestionController.updateQuestion)
// delete question
router.delete('/questions/:questionId', authenticate, authorize, QuestionController.deleteQuestion)
// search for question
router.post('/questions/search', QuestionController.searchQuestion);

module.exports = router;