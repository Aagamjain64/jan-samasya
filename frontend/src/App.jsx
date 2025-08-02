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
import Footer from './components/footer';
import EditProblemForm from './components/EditProblemForm';
import CityWise from './components/CityWise';
import ContactUs from './components/Contact';

function App() {
const [searchTerm, setSearchTerm] = useState("");
const [showForm, setShowForm] = useState(false); // 
  return (            
    <Router>
        <div className="app-bg" style={{ minHeight: "100vh" }}>
      <MyNavbar searchTerm={searchTerm} setSearchTerm={setSearchTerm}  setShowForm={setShowForm}  />


      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/Aboutus" element={<Aboutus />} />
        <Route path="/contact" element={<ContactUs />} />

        <Route path="/create" element={<CreateProblemForm  showForm={showForm} setShowForm={setShowForm}/>} />
  <Route path="/problems" element={<AllProblems searchTerm={searchTerm} />} />
  <Route path="/" element={<Front />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/show" element={<Show />} />
        <Route path="/my-problems" element={<MyProblems />} />
        <Route path="/edit/:id" element={<EditProblemForm />} />
        <Route path="/city-wise" element={<CityWise />} />
        
      </Routes>
      <Footer/>
      </div>
    </Router>
  );
}

export default App;
