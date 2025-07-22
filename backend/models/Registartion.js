const mongoose = require("mongoose");
const User = require("./signup")
const Schema = mongoose.Schema;
const registrationSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // ✅ Reference to user
    required: true,
    unique:true
  },
  number:{
    type:String,
    required:false,
   
  },
  firstname:{
    type:String,
    required:true
  },
  lastname:{
    type:String,
    required:true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  age:{
    type: Number,
    required:true,
  },
  gender: {
    type: String,
   
    required: true
  }
});

const Registration = mongoose.model("Registration", registrationSchema);
module.exports = Registration;
