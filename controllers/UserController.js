let { User } = require('../database/models');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const secret = process.env.SECRET;

class UserController{

    /**
     * Register new user
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
                    return res.status(201).json({
                        error:false,
                        data: data,
                        message: 'Registration Successful'});
                })
                .catch(err => { return res.status(500).json({message: err.message}); })
        }catch(e){
            return res.status(500).json({message:e.message});
        }
    }

    /**
     * User login
     */
    static userLogin(req, res){
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
                    message:errors,

                });
            }

            User.findOne({ email: email })
                .then(user => {
                    if (!user) {
                        res.status(401).json({error:true,message: "Sorry no user found"});
                    } else {
                        var passwordIsValid = bcrypt.compareSync(password, user.password);
                        if (!passwordIsValid) {
                            return res.status(401).json({
                                error: true,
                                message: 'Email and password is incorrect.'
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
                                name: user.name,
                                message: 'User found and logged in successfully'
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
     * Fetch all users
     */
    static fetchUsers(req, res){
        try{
            User.find()
                .then(data => {
                    res.status(200).json(data)
                }).catch(err =>  res.status(500).json({message: err.message}) );
        }catch (e) {
            return res.sendStatus(500);
        }
    }

    /**
     * Fetch single user by id
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
     * Search for user
     */
    static searchExistingUser(req, res){
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