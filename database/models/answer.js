const mongoose = require('mongoose')

let answerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, `Title required.`],
  },
  description: {
    type: String,
    required: [true, `Description required.`],
  },
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: []
  }],
  downvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: []
  }],
  totalVote: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: [true, `Invalid questionId`]
  },
  createdAt: {
    type: Date
  }
})
answerSchema.pre('save', function (next) {
  this.totalVote = this.upvotes.length - this.downvotes.length
  next()
})

let Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;