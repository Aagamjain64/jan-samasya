import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import MyNavbar from './components/navbar';
import Home from './components/Home'; 
import Aboutus from './components/Aboutus';
import CreateProblemForm from './components/Create';
import AllProblems from './components/Allproblems';
import Show from './components/show'; // ✅ NEW import
import Signup from './components/signup';
import './index.css';
import Login from './components/login';
import Registration from './components/Registration';
import Front from './components/front'; 
import MyProblems from './components/Myproblem';




function App() {
const [searchTerm, setSearchTerm] = useState("");
const [showForm, setShowForm] = useState(false); // 
  return (            
    <Router>
      <MyNavbar searchTerm={searchTerm} setSearchTerm={setSearchTerm}  setShowForm={setShowForm}  />
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>

      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/Aboutus" element={<Aboutus />} />
        <Route path="/create" element={<CreateProblemForm  showForm={showForm} setShowForm={setShowForm}/>} />
  <Route path="/problems" element={<AllProblems searchTerm={searchTerm} />} />
  <Route path="/" element={<Front />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/show" element={<Show />} />
        <Route path="/my-problems" element={<MyProblems />} />

      </Routes>
    </Router>
  );
}

export default App;
