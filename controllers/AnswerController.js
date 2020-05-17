const bcrypt = require('bcryptjs');
const { authenticate, authorize } = require('../middlewares/auth');
const notificationServer = require('../middlewares/notificationServer');

// Bring in Answer model
let { Answer, Question } = require('../database/models');

class AnswerController{
	
	/**
	* fetch question answers
	*/
	static fetchQuestionAnswers(req, res){
		try{

			Answer.find({ question: req.params.questionId })
			.populate('upvotes', 'name')
			.populate('downvotes', 'name')
			.populate('user', 'name')
			.then(answers => {
			res.status(200).json(answers)
			})
			.catch(err => { res.status(500).json({message: err.message}); });
		}catch(e){
		res.status(500).json({message: e.message});
		}
	}

	/**
	* fetch user question answered
	*/
	static fetchUserQuestionAnswered(req, res){
		Answer.find({ user: req.user._id })
	    .populate('user')
	    .populate('question')
	    .then(answers => {
	      res.status(200).json(answers)
	    })
	    .catch(err => { res.status(500).json({message: err.message}); });
	}

	/**
	* answer question
	*/
	static answerQuestion(req,res){
		try{

		  	let { title, description, question } = req.body;

		    // validate entry
		    req.checkBody('title', 'The Title Field is required').notEmpty();
		    req.checkBody('description', 'The Description Field is required').notEmpty();
		    req.checkBody('question', 'The Question Field is required').notEmpty();


		    let errors = req.validationErrors();
		    if(errors){
		      return res.status(200).json({
		        error:true,
		        message:errors
		      });
		    }

		    let newAnswer = {
		      title, description, question,
		      user: req.user._id,
		      upvotes: [req.user._id],
		      createdAt: new Date()
		    }

		    Answer.create(newAnswer)
		    .then(async answer => {
		      try{
		          let question_subscribed  = await Question.find({_id: question});
		          let notify = await notificationServer.sendPushToUser(`/topics/question_subscribe_${question}`, {
		                        data: {'message': 'New answer for:'+question_subscribed.title}
		                    });
		          console.log(notify);
		      }catch(error){
		        return res.status(500).json({
		          error: true,
		          message: error.message
		        });
		      }
		      return res.status(201).json(answer)
		    })
		    .catch(err => { res.status(500).json({message: err.message}); });
		}catch(e){
			res.status(500).json({message: e.message});
		}
	}

	/**
	* fetch single answer by id
	*/
	static fetchSingleAnswer(req, res){
		try{

			Answer.findOne({ _id: req.params.answerId })
			.populate('user')
			.populate('question')
			.then(answer => {
			  res.status(200).json(answer)
			})
			.catch(err => { res.status(500).json({message: err.message}); })
		}catch(e){
			res.status(500).json({message: e.message});
		}
	}

	/**
	* upvote answer
	*/
	static upvoteAnswer(req, res){
		try{

		    Answer.findOne({ upvotes: req.user._id, _id: req.params.answerId })
		    .then(question => {
		      if (question) {
		        return Answer.findOneAndUpdate({ _id: req.params.answerId }, { $pull: { upvotes: req.user._id }}, { new: true })
		      } else {
		        return Answer.findOneAndUpdate({ _id: req.params.answerId }, { $addToSet: { upvotes: req.user._id }, $pull: { downvotes: req.user._id } }, { new: true })
		      }
		    })
		    .then(question => {
		      return question.save()
		    })
		    .then(question => {
		      res.status(200).json(question)
		    })
		    .catch(err => { res.status(500).json({message: err.message}); });
		}catch(e){
			res.status(500).json({message: e.message});
		}
	}

	/**
	* downvote answer
	*/
	static downvoteAnswer(req, res){
		try{

		    Answer.findOne({ downvotes: req.user._id, _id: req.params.answerId })
		    .then(question => {
		      if (question) {
		        return Answer.findOneAndUpdate({ _id: req.params.answerId }, { $pull: { downvotes: req.user._id }}, { new: true })
		      } else {
		        return Answer.findOneAndUpdate({ _id: req.params.answerId }, { $addToSet: { downvotes: req.user._id }, $pull: { upvotes: req.user._id } }, { new: true })
		      }
		    })
		    .then(question => {
		      return question.save()
		    })
		    .then(question => {
		      res.status(200).json(question)
		    })
		    .catch(err => { res.status(500).json({message: err.message}); })
		}catch(e){
			res.status(500).json({message: e.message});
		}
	}

	/**
	* search for answers
	*/
	static searchAnswers(req, res){
		try{

			let { search } = req.body;

			 // validate entry
			req.checkBody('search', 'The Search Field is required').notEmpty();

			let errors = req.validationErrors();
			if(errors){
			  return res.status(200).json({
			    error:true,
			    message:errors
			  });
			}

			Answer.find({title:search})
			.then(data => {
			  res.status(200).json(data)
			})
			.catch(err =>  res.status(500).json({message: err.message}) );
		}catch(e){
			res.status(500).json({message: e.message});
		}
	}

	/**
	* update answer
	*/
	static updateAnswer(req, res){
		try{
    
			// validate entry
			req.checkBody('title', 'The Title Field is required').notEmpty();
			req.checkBody('description', 'The Description Field is required').notEmpty();
			req.checkBody('question', 'The Question Field is required').notEmpty();


			let errors = req.validationErrors();
			if(errors){
			  return res.status(200).json({
			    error:true,
			    message:errors
			  });
			}

			Answer.findOneAndUpdate({ _id: req.params.answerId }, req.body, { new: true })
			.then(answer => {
			  res.status(200).json(answer)
			})
			.catch(err => { res.status(500).json({message: err.message}); })
		}catch(e){
			res.status(500).json({message: e.message});
		}
	}

	/**
	* delete answer
	*/
	static deleteAnswer(req, res){
		try{

		    Answer.findOneAndDelete({ _id: req.params.answerId })
		    .then(answer => {
		      const response = {
		        message: 'Successfully deleted answer.'
		      }
		      res.status(200).json(response)
		    })
		    .catch(err => { res.status(500).json({message: err.message});})
		}catch(e){
			res.status(500).json({message: e.message});
		}
	}
}

module.exports = AnswerController;