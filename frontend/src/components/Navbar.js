import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';

const Navbar = ({ isAuthenticated, onLogout, user }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  const handleLogout = () => {
    onLogout();
    navigate('/');
    setMenuOpen(false);
  };
  
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-blue-600 font-bold text-xl">
              <img src={logo} alt="Journee Logo" className="h-8 w-auto mr-2" />
            </Link>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium text-sm">
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/new-trip" className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium text-sm">
                  Plan a Trip
                </Link>
                <Link to="/profile" className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium text-sm">
                  Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-600 px-3 py-2 font-medium text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium text-sm">
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>
          
          <div className="flex items-center md:hidden">
            <button 
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 inline-flex items-center justify-center p-2 rounded-md"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {menuOpen ? (
                <i className="fas fa-times text-xl"></i>
              ) : (
                <i className="fas fa-bars text-xl"></i>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`${menuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="pt-2 pb-3 space-y-1 bg-white shadow-md">
          <Link 
            to="/" 
            className="text-gray-700 hover:bg-gray-100 block px-3 py-2 text-base font-medium"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link 
                to="/new-trip" 
                className="text-gray-700 hover:bg-gray-100 block px-3 py-2 text-base font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Plan a Trip
              </Link>
              <Link 
                to="/profile" 
                className="text-gray-700 hover:bg-gray-100 block px-3 py-2 text-base font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>
              <button 
                onClick={handleLogout}
                className="text-gray-700 hover:bg-gray-100 w-full text-left block px-3 py-2 text-base font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="text-gray-700 hover:bg-gray-100 block px-3 py-2 text-base font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="text-gray-700 hover:bg-gray-100 block px-3 py-2 text-base font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;