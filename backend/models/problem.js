const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProblemSchema = new Schema({
  ProblemTitle: {
    type: String,
    required: true,
    trim: true,
  },
  ProblemDescription: {
    type: String,
    required: true,
  },
  ProblemCategory: {
    type: String,
    required: true,
  },
  State: {
    type: String,
    required: true,
  },
  Coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  City: {
    type: String,
    required: true
  },
  Pincode: {
    type: String,
    required: true
  },
  Image: {
    type: String 
  },
  Urgency: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  isVotingEnabled: {
    type: Boolean,
    default: false
  },
  PostedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  Votes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  Likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  Dislikes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
ImageURL: {
  type: String
},
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Problem", ProblemSchema);
