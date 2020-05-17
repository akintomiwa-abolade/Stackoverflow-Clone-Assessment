const bcrypt = require('bcryptjs');
const { authenticate, authorize } = require('../middlewares/auth');
const notificationServer = require('../middlewares/notificationServer');

// Bring in Question model
let { Question, Answer} = require('../database/models');

class QuestionController{

	/**
	* fetch all questions
	*/
	static fetchAllQuestions(req, res){
		Question.find()
		.populate('upvotes', 'name')
		.populate('downvotes', 'name')
		.populate('user', 'name')
		.sort({ createdAt: 'desc'})
		.then(questions => {
			res.status(200).json(questions);
		})
		.catch(err => { req.status(500).json({message:er.message});})
	}

	/**
	* ask new question
	*/
	static createQuestion(req, res){
		try{

		  	let { title, description } = req.body;

		    // validate entry
		    req.checkBody('title', 'The Title Field is required').notEmpty();
		    req.checkBody('description', 'The Description Field is required').notEmpty();

		    let errors = req.validationErrors();
		    if(errors){
		      return res.status(200).json({
		        error:true,
		        message:errors
		      });
		    }

		    let newQuestion = {
		      title, description,
		      user: req.user._id,
		      upvotes: [req.user._id],
		      createdAt: new Date()
		    }

		    Question.create(newQuestion)
		    .then(question => {
		      res.status(201).json(question);
		    })
		    .catch(err => { 
		      res.status(500).json({message: err.message}); 
		    });
		}catch(e){
			res.status(500).json({message: e.message});
		}
	}

	/**
	* fetch list of questions asked by loggedin user
	*/
	static fetchUserQuestions(req, res){
		Question.find({ user: req.user._id })
		.populate('upvotes', 'name')
		.populate('downvotes', 'name')
		.populate('user', 'name')
		.then(questions => {
			res.status(200).json(questions);
		})
		.catch(err => { res.status(500).json({message: err.message}); })
	}

	/**
	* fetch single question by id
	*/
	static fetchSingleQuestion(req, res){
		try{

		  	Question.findOne({_id: req.params.questionId})
		  	.populate('upvotes', 'name')
		  	.populate('downvotes', 'name')
		  	.populate('user', 'name')
		  	.sort({ createdAt: 'desc'})
		  	.then(question => {
		    	res.status(200).json(question);
		  	})
		  	.catch(err => { res.status(500).json({message: err.message}); });
		}catch(e){
			res.status(500).json({message: e.message});
		}
	}

	/**
	* subscribe to question
	*/
	static async subscribeToQuestion(req, res){
		try{
	       let subscribe = await notificationServer.subscribeToQuestion(`${req.user.fcm_token}`,`/topics/question_subscribe_${req.body.questionId}`);
	       console.log(subscribe.errors);
		}catch(e){
			return res.status(200).json({
			  error: true,
			  message: e.message
			});
		}

		return res.status(201).json({
		  error: false,
		  message: "Subscription Successful."
		});
	}

	/**
	* upvote question
	*/
	static upvoteQuestion(req, res){
		try{
			console.log(req.user._id, req.params.questionId)
			Question.findOne({ upvotes: req.user._id, _id:req.params.questionId })
			.then(question => {
			  if(question) {
			    return Question.findOneAndUpdate({ _id: req.params.questionId }, { $pull: { upvotes: req.user._id }/* , $pull: { downvotes: req.user._id } */}, { new: true })
			  } else {
			    return Question.findOneAndUpdate({ _id: req.params.questionId }, { $addToSet: { upvotes: req.user._id }, $pull: { downvotes: req.user._id }}, { new: true })
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
	* downvote question
	*/
	static downvoteQuestion(req, res){
		try{

			Question.findOne({ downvotes: req.user._id, _id:req.params.questionId })
			.then(question => {
			  if(question) {
			    return Question.findOneAndUpdate({ _id: req.params.questionId }, { $pull: { downvotes: req.user._id } }, { new: true })
			  } else {
			    return Question.findOneAndUpdate({ _id: req.params.questionId }, { $addToSet: { downvotes: req.user._id }, $pull: { upvotes: req.user._id }}, { new: true })
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
	* update question
	*/
	static updateQuestion(req, res){
		try{

			// validate entry
			req.checkBody('title', 'The Title Field is required').notEmpty();
			req.checkBody('description', 'The Description Field is required').notEmpty();

			let errors = req.validationErrors();
			if(errors){
			  return res.status(200).json({
			    error:true,
			    message:errors
			  });
			}

				Question.findOneAndUpdate({_id: req.params.questionId}, req.body, { new: true })
			.then(question => {
			  res.status(200).json(question)
			})
			.catch(err => { res.status(500).json({message: err.message}); });
		}catch(e){
			res.status(500).json({message: e.message});
		}
	}

	/**
	* search question
	*/
	static searchQuestion(req, res){
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

		  Question.find({title:search})
		  .then(data => {
		    res.status(200).json(data)
		  })
		  .catch(err =>  res.status(500).json({message: err.message}) );
		}catch(e){
		  res.status(500).json({message: e.message});
		}
	}

	/**
	* delete question
	*/
	static deleteQuestion(req, res){
		try{

			Answer.deleteMany({ question: req.params.questionId })
			.then(result => {
			 return Question.findOneAndDelete({_id: req.params.questionId})
			})
			.then(question => {
				const response = {
				  message: 'Successfully deleted question.'
				}
				res.status(200).json(response)
			})
			.catch(err => { res.status(500).json({message: err.message }); })
		}catch(e){
		  res.status(500).json({message: e.message});
		}
	}
}

module.exports = QuestionController;