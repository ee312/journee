import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NewTrip from './pages/NewTrip';
import ItineraryView from './pages/ItineraryView';
import Profile from './pages/Profile';
import Footer from './components/Footer';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // const token = true;
    // const userData = true;
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);
  
  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };
  
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} user={user} />
        <main className="flex-1 px-4 py-6 mx-auto w-full max-w-7xl">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/login" 
              element={isAuthenticated ? <Navigate to="/profile" /> : <Login onLogin={handleLogin} />} 
            />
            <Route 
              path="/register" 
              element={isAuthenticated ? <Navigate to="/profile" /> : <Register onLogin={handleLogin} />} 
            />
            <Route 
              path="/profile" 
              element={isAuthenticated ? <Profile user={user} setUser={setUser} /> : <Navigate to="/login" />}
            />
            <Route 
              path="/new-trip" 
              element={isAuthenticated ? <NewTrip user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/itinerary/:id" 
              element={isAuthenticated ? <ItineraryView user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/profile" 
              element={isAuthenticated ? <Profile user={user} setUser={setUser} /> : <Navigate to="/login" />} 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;