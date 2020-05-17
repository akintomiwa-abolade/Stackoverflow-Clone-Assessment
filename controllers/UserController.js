const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.SECRET;

// Bring in User model
let { User } = require('../database/models');

class UserController{

	/**
	* register new user
	*/
	static registerUser(req, res){
		try{

			let { name, email, password, fcm_token} = req.body;
			req.checkBody('name', 'The Name Field is required').notEmpty();
			req.checkBody('email', 'The Email Field is required').notEmpty();
			req.checkBody('email', 'The Email is not valid').isEmail();
			req.checkBody('password', 'The Password Field is required').notEmpty();
			req.checkBody('fcm_token', 'The fcm_token Field is required').notEmpty();

			let errors = req.validationErrors();
			if(errors){
				return res.status(200).json({
					error:true,
					message:errors
				});
			}

			let hashedPassword = bcrypt.hashSync(password, 10);

			let newUser = {
			  name, email, password: hashedPassword, fcm_token
			}

			User.create(newUser)
			.then(data => {
				return res.status(201).json(data);
			})
			.catch(err => { return res.status(500).json({message: err.message}); })
		}catch(e){
			return res.status(500).json({message:e.message});
		}
	}

	/**
	* login user
	*/
	static loginUser(req, res){
		try{
			let { email, password } = req.body;

			// validate entries
			req.checkBody('email', 'The Email Field is required').notEmpty();
			req.checkBody('email', 'The Email is not valid').isEmail();
			req.checkBody('password', 'The Password Field is required').notEmpty();

			let errors = req.validationErrors();
			if(errors){
				return res.status(200).json({
					error:true,
					message:errors
				});
			}

		    User.findOne({ email: email })
			.then(user => {
				if (!user) {
				  res.status(401).json({error:true,message: "sorry no user found"});
				} else {
					var passwordIsValid = bcrypt.compareSync(password, user.password);
					if (!passwordIsValid) {
						return res.status(401).json({
						  error: true,
						  message: 'Authentication failed.'
						});
					} else {

						let obj = {
						  id: user._id,
						  email: user.email,
						  fcm_token:user.email
						}

						let token = jwt.sign({
						  user: obj
						}, secret, {
						  expiresIn: '1d'
						});

						return res.status(200).json({
						  token,
						  email,
						  name: user.name
						});
					}
				}
			})
			.catch(err => { res.status(500).json({message: err.message}) })

		}catch(e){
			return res.status(500).json({message:e.message});
		}
	}

	/**
	* fetch all users
	*/
	static fetchAllUsers(req, res){
		User.find()
		.then(data => {
			res.status(200).json(data);
		})
		.catch(err =>  res.status(500).json({message: err.message}) );
	}

	/**
	* fetch single user by id
	*/
	static fetchSingleUser(req, res){
		try{

			User.findOne({_id: req.params.userId})
			.then(user => {
				res.status(200).json(user)
			})
			.catch(err => res.status(500).json({message: err.message}) );
		}catch(e){
			return res.status(500).json({message:e.message});
		}
	}

	/**
	* search for user
	*/
	static searchUserInfo(req, res){
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

			User.find({name:search})
			.then(data => {
				res.status(200).json(data)
			})
			.catch(err =>  res.status(500).json({message: err.message}) );
		}catch(e){
			return res.status(500).json({message:e.message});
		}
	}
}

module.exports = UserController;