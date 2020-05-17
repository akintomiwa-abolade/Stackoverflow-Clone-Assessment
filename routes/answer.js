/**
|----------------------------------
| Answer Api Route
|----------------------------------
*/
const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/auth');
const AnswerController = require('../controllers/AnswerController');

/**
 * @swagger
 * /answers/question/{questionId}:
 *   get:
 *     tags:
 *       - Answers
 *     name: List question answers
 *     summary: List all answers for specific question asked
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
 *         description: Single question answers object
 *       500:
 *         description: Internal server error
 */
router.get('/answers/question/:questionId', AnswerController.fetchQuestionAnswers);
// get all question answered by loggedin user
router.get('/answers/user', authenticate, AnswerController.fetchUserQuestionAnswered);
/**
 * @swagger
 * /answers:
 *   post:
 *     tags:
 *       - Answers
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
 *           $ref: '#/definitions/Answer'
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *             description:
 *               type: string
 *             question:
 *               type: string
 *         required:
 *           - title
 *           - decription
 *           - question
 *     responses:
 *       '200':
 *         description: Validation error message
 *       '201':
 *         description: New answer created successfully for question
 *       '403':
 *         description: No auth token
 *       '500':
 *         description: Internal server error
 */
router.post('/answers', authenticate, AnswerController.answerQuestion);
// get specific answer
router.get('/answers/:answerId', AnswerController.fetchSingleAnswer);
// upvote answer
router.put('/answers/:answerId/upvote', authenticate, AnswerController.upvoteAnswer);
// downvote answer
router.put('/answers/:answerId/downvote', authenticate, AnswerController.downvoteAnswer);
/**
 * @swagger
 * /answers/search:
 *   post:
 *     tags:
 *       - Answers
 *     name: Search Answers
 *     summary: Search answers by title
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
 *         description: search answer result array
 *       '500':
 *         description: Internal server error
 */
router.post('/answers/search', AnswerController.searchAnswers);
// update answer
router.put('/answers/:answerId', authenticate, authorize, AnswerController.updateAnswer);
// delete answer
router.delete('/answers/:answerId', authenticate, authorize, AnswerController.deleteAnswer);


module.exports = router;