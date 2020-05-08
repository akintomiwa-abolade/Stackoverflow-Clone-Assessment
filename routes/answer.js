/**
|----------------------------------
| Answer Api Route
|----------------------------------
*/
const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/auth');
const AnswerController = require('../controllers/AnswerController');

// view specific question answers
router.get('/answers/question/:questionId', AnswerController.fetchSpecificQuestionAnswer);
// get all question answered by loggedin user
router.get('/answers/user', authenticate, AnswerController.fetchAnswersByUser);
// answer question
router.post('/answers', authenticate, AnswerController.answerQuestion);
// get specific answer
router.get('/answers/:answerId', AnswerController.fetchAnswer);
// upvote answer
router.put('/answers/:answerId/upvote', authenticate, AnswerController.upVoteAnswer);
// downvote answer
router.put('/answers/:answerId/downvote', authenticate, AnswerController.downVoteAnswer);
// search for answer
router.post('/answers/search', AnswerController.searchAnswer);
// update answer
router.put('/answers/:answerId', authenticate, authorize, AnswerController.updateAnswer);
// delete answer
router.delete('/answers/:answerId', authenticate, authorize, AnswerController.deleteAnswer);


module.exports = router;