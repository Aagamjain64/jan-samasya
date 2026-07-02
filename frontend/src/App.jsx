import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

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
import Terms from './components/Terms';
import MyProblems from './components/Myproblem';
import Footer from './components/footer';
import EditProblemForm from './components/EditProblemForm';
import CityWise from './components/CityWise';
import ContactUs from './components/Contact';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './components/AdminDashboard';
import ManageProblems from './components/ManageProblems';
import JanSamasyaAssistant from './components/JanSamasyaAssistant';

function AppRoutes({ searchTerm, setSearchTerm, showForm, setShowForm }) {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '/create') {
      setShowForm(false);
    }
    document.body.style.overflow = '';
  }, [location.pathname, setShowForm]);

  return (
    <>
      <MyNavbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} setShowForm={setShowForm} />


      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/aboutus" element={<Aboutus />} />
        <Route path="/Aboutus" element={<Navigate to="/aboutus" replace />} />
        <Route path="/contact" element={<ContactUs />} />

        <Route path="/create" element={<CreateProblemForm showForm={showForm} setShowForm={setShowForm} />} />
        <Route path="/problems" element={<AllProblems searchTerm={searchTerm} />} />
        <Route path="/" element={<Front />} />
        <Route path="/terms" element={<Terms />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/show" element={<Show />} />
        <Route path="/my-problems" element={<MyProblems />} />
        <Route path="/edit/:id" element={<EditProblemForm />} />
        <Route path="/city-wise" element={<CityWise />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage"
          element={
            <ProtectedRoute roles={['mla', 'govt_employee']}>
              <ManageProblems />
            </ProtectedRoute>
          }
        />
        
      </Routes>
      <Footer />
      <JanSamasyaAssistant />
    </>
  );
}

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  return (
    <Router>
      <div className="app-bg" style={{ minHeight: '100vh' }}>
        <AppRoutes
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showForm={showForm}
          setShowForm={setShowForm}
        />
      </div>
    </Router>
  );
}

export default App;
