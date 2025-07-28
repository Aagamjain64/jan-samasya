const express = require('express');
const ProblemRoutes = require('./Routes/ProblemRoutes');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const auth=require('./Routes/loginroute');
const Registration=require("./Routes/RegistrationRoute");
const app = express();

// ✅ Apply CORS middleware FIRST
app.use(cors({
  origin:  ['http://localhost:5173', 'https://jan-samasya.netlify.app'],
  credentials: true
}));

// ✅ Then JSON body parser
app.use(express.json());

// ✅ Then your routes
app.use('/', ProblemRoutes);
app.use('/',auth);
app.use('/',Registration);
// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Mongo Error", err));

// ✅ Start server
app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running at http://localhost:${process.env.PORT}`);
});
