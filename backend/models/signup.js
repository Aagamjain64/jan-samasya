const mongoose= require("mongoose")
const Schema= mongoose.Schema;
const jwt = require('jsonwebtoken');
const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,   
    required: true,
     
  },
  email: {
    type: String,   
    required: true,
    unique: true   
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


UserSchema.methods.generateToken=async function(){
const Registration=require('./Registartion');

    try{
      const registration = await Registration.findOne({ user: this._id });
if (!registration) {
  throw new Error("No registration found for this user");
}

return jwt.sign({
  userId: this._id.toString(),
  username: this.username,
  email: this.email,
  city: registration.city,     // ✅ yeh sahi hai
  state: registration.state,   // ✅ agar state bhi hai
}, process.env.JWT_SECRET, { expiresIn: "10m" });

    }
    
    catch(error){
        console.error(error);
        return null;
    }



}





module.exports=mongoose.model("User",UserSchema);

