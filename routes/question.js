/**
|----------------------------------
| Question Api Route
|----------------------------------
*/

const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/auth');

const QuestionController = require('../controllers/QuestionController');

/**
 * @swagger
 * /questions:
 *   get:
 *     tags:
 *       - Questions
 *     name: List questions
 *     summary: List all questions asked
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: All questions object
 *         schema:
 *           $ref: '#/definitions/User'
 *       500:
 *         description: Internal server error
 */
router.get('/questions', QuestionController.fetchAllQuestions);
/**
 * @swagger
 * /questions:
 *   post:
 *     tags:
 *       - Questions
 *     name: Ask Question
 *     summary: Ask new question
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           $ref: '#/definitions/Question'
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *             description:
 *               type: string
 *         required:
 *           - title
 *           - description
 *     responses:
 *       '201':
 *         description: New question created successfully
 *       '403':
 *         description: No token provided
 *       '500':
 *         description: Internal server error
 */
router.post('/questions', authenticate, QuestionController.createQuestion);
// view all user questions
router.get('/questions/user', authenticate, QuestionController.fetchUserQuestions);
/**
 * @swagger
 * /questions/{questionId}:
 *   get:
 *     tags:
 *       - Questions
 *     name: Fetch Single Question
 *     summary: Display user Single Question
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: questionId
 *         schema:
 *           type: string
 *         required:
 *           - questionId
 *     responses:
 *       200:
 *         description: Single question object
 *       500:
 *         description: Internal server error
 */
router.get('/questions/:questionId', QuestionController.fetchSingleQuestion);
/**
 * @swagger
 * /questions/subscribe:
 *   post:
 *     tags:
 *       - Questions
 *     name: Subscribe to Question
 *     summary: A user subscribe to question
 *     security:
 *       - bearerAuth: []
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
 *             questionId:
 *               type: string
 *         required:
 *           - questionId
 *     responses:
 *       '200':
 *         description: Subscription Failed with error message
 *       '201':
 *         description: Subscription Successful
 *       '403':
 *         description: No auth token
 *       '500':
 *         description: Internal server error
 */
router.post('/questions/subscribe', authenticate, QuestionController.subscribeToQuestion)
/**
 * @swagger
 * /questions/{questionId}/upvote:
 *   put:
 *     tags:
 *       - Questions
 *     name: UpVote Question
 *     summary: User choose to upvote a question
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: questionId
 *         schema:
 *           type: string
 *         required:
 *           - questionId
 *     responses:
 *       200:
 *         description: upvote successful and question object
 *       '403':
 *         description: No auth token
 *       500:
 *         description: Internal server error
 */
router.put('/questions/:questionId/upvote', authenticate, QuestionController.upvoteQuestion);
/**
 * @swagger
 * /questions/{questionId}/downvote:
 *   put:
 *     tags:
 *       - Questions
 *     name: DownVote questions
 *     summary: User choose to downvote a question
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: questionId
 *         schema:
 *           type: string
 *         required:
 *           - questionId
 *     responses:
 *       200:
 *         description: downvote successful and question object
 *       '403':
 *         description: No auth token
 *       500:
 *         description: Internal server error
 */
router.put('/questions/:questionId/downvote', authenticate, QuestionController.downvoteQuestion);
// update question
router.put('/questions/:questionId', authenticate, authorize, QuestionController.updateQuestion)
// delete question
router.delete('/questions/:questionId', authenticate, authorize, QuestionController.deleteQuestion)
/**
 * @swagger
 * /questions/search:
 *   post:
 *     tags:
 *       - Questions
 *     name: Search questions
 *     summary: Search questions by title
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
 *         description: search question result array
 *       '500':
 *         description: Internal server error
 */
router.post('/questions/search', QuestionController.searchQuestion);

module.exports = router;