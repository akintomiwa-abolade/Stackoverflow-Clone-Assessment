const jwt = require('jsonwebtoken');
const { User, Question, Answer } = require('../database/models');

require('dotenv').config();
var secret = process.env.SECRET;

module.exports = {
  authenticate: function(req, res, next) {
    let token = req.headers["authorization"];

    if (token) {
      jwt.verify(token, secret, function(err, decoded) {
        if (err) {
          res.json({
            success: false,
            message: 'Failed to authenticate token'
          });
        } else {

          User.findOne({
           email: decoded.user.email
          })
          .then(user => {
            if(user) {
              req.user = user;
              next();
            } else {
              next({ status: 401, message: 'User is not valid'});
            }
          })
          .catch(err => {
            next({ status: 500, message: err.mesasge});
          });
        }
      });
    } else {
      res.status(403).json({
        success: false,
        message: 'No token provided'
      });
    }
  },
  authorize: function(req, res, next) {
    let { questionId, answerId } = req.params
    Promise.all([
      Question.findOne({ _id: questionId }),
      Answer.findOne({ _id: answerId }),
    ])
      .then(result => {
        let authId = (result[0]) ? result[0].user.toString() : result[1].user.toString()
        if(authId != req.user._id.toString()) {
          next({ status: 401, message: 'un-authorized access'})
        } else {
          next()
        }
      })
      .catch(err => {
        next({ status: 500, message: err.message})
      })
  },
}
