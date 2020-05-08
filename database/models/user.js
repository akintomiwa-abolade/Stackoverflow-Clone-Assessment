const mongoose = require('mongoose');
/**
 * @swagger
 * definitions:
 *    User:
 *     type: object
 *     properties:
 *       _id:
 *         type:objectid
 *       name:
 *         type:string
 *       email:
 *         type:string
 *       password:
 *         type:string
 *       fcm_token:
 *         type:string
 *       required:
 *         - name
 *         - email
 *         - password
 *         - fcm_token
 */
let userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, `Name required.`],
  },
  email: {
    type: String,
    required: [ true, 'Email is required' ],
    validate: [{
      validator: function(value) {
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
          throw 'Invalid email format'
        }
      },
    },
    {
      validator: function(value) {
        return User.find({
              _id: { $ne: this._id },
              email: value
           })
          .then( data => {
              if(data.length !== 0) {
                  throw 'Email has been used';
              }
          })
          .catch(err => {
              throw err;
          });
      }
    }]
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
  },
  fcm_token: {
    type: String
  }
})


let User = mongoose.model('User', userSchema)

User.schema.path('email').validate(function (input) {
  User.findOne({email: input})
    .then(found => {
      if(found) {
        return false
      } else {
        return true
      }
    })
    .catch(err => {console.log(err)})
}, 'Email has been used.')

module.exports = User;
