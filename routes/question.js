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
// ask question
router.post('/questions', authenticate, QuestionController.fetchQuestions);
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