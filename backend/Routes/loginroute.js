const express = require('express');
const User = require("../models/signup");
const bcrypt = require("bcrypt");
const router = express.Router();


function isValidPassword(password) {
  let hasUpper = false;
  let hasLower = false;
  let hasDigit = false;
  let hasSymbol = false;

  for (let i = 0; i < password.length; i++) {
    const ch = password[i];
    if (ch >= 'A' && ch <= 'Z') hasUpper = true;
    else if (ch >= 'a' && ch <= 'z') hasLower = true;
    else if (ch >= '0' && ch <= '9') hasDigit = true;
    else hasSymbol = true;
  }

  return hasUpper && hasLower && hasDigit && hasSymbol && password.length >= 8;
}

// ...existing code...

router.post("/signup", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    console.log("user data is coming", req.body);
    if (!isValidPassword(password)) {
      return res.status(400).json({
        msg: "Password must be at least 8 characters long and include uppercase, lowercase, digit, and special character."
      });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(402).json({ msg: "Email and username already exists bro " });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashPassword,
      email
    });

    await user.save();
    console.log("user saved in DB");

    // Generate a temporary token so user can proceed to registration
    const jwt = require('jsonwebtoken');
    const tempToken = jwt.sign({
      userId: user._id.toString(),
      username: user.username,
      email: user.email
    }, process.env.JWT_SECRET, { expiresIn: "10m" });

    res.status(201).json({ msg: 'User Created. Please complete registration.', token: tempToken });

  } catch (err) {
    console.log("i think this is error", err);
    res.status(501).json({ error: err.message });
  }
});

// ...existing code...

router.post("/login",async(req,res)=>{
    const {username,password}=req.body;
   const existing = await User.findOne({username}); 
   try{
   if(!existing){
    return res.status(401).json({msg:"inavlid username"});
   }
    const isMatch = await bcrypt.compare(password, existing.password);
    if(!isMatch){
         return res.status(401).json({msg:"inavlid password"});
    }
    // Try to generate full token (requires registration)
    const token= await existing.generateToken();
    if (token) {
      res.status(200).json({msg:"login successfully",token});
    } else {
      // Registration not complete, generate temporary token
      const jwt = require('jsonwebtoken');
      const tempToken = jwt.sign({
        userId: existing._id.toString(),
        username: existing.username,
        email: existing.email
      }, process.env.JWT_SECRET, { expiresIn: "10m" });
      res.status(200).json({msg: "Please complete registration.", token: tempToken});
    }
}
catch(err){
    console.error("login failed",err);
    res.status(500).json({error:err.message});
}
});



module.exports = router;
