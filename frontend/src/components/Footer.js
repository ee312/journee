import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-4 xl:gap-8">
          <div className="xl:col-span-1">
            <div className="flex items-center">
              <img className="h-8 w-auto mr-2" src={logo} alt="Journee Logo" />
            </div>
            <p className="mt-4 text-gray-300 text-sm">
              Simplifying travel planning with AI-powered personalized itineraries.
            </p>
            <div className="mt-6 flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white" aria-label="Facebook">
                <i className="fab fa-facebook-f text-lg"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white" aria-label="Twitter">
                <i className="fab fa-twitter text-lg"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white" aria-label="Instagram">
                <i className="fab fa-instagram text-lg"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white" aria-label="Pinterest">
                <i className="fab fa-pinterest text-lg"></i>
              </a>
            </div>
          </div>
          
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-3">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                  Company
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link to="/about" className="text-base text-gray-300 hover:text-white">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="text-base text-gray-300 hover:text-white">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                  Resources
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link to="/guides" className="text-base text-gray-300 hover:text-white">
                      Travel Guides
                    </Link>
                  </li>
                  <li>
                    <Link to="/tips" className="text-base text-gray-300 hover:text-white">
                      Travel Tips
                    </Link>
                  </li>
                  <li>
                    <Link to="/faq" className="text-base text-gray-300 hover:text-white">
                      FAQs
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                  Legal
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link to="/terms" className="text-base text-gray-300 hover:text-white">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacy" className="text-base text-gray-300 hover:text-white">
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                  Subscribe
                </h3>
                <p className="mt-4 text-base text-gray-300">
                  Get the latest travel tips and offers.
                </p>
                <div className="mt-4">
                  <form className="flex flex-col sm:flex-row lg:flex-col xl:flex-row">
                    <input
                      type="email"
                      placeholder="Your email"
                      className="px-4 py-2 text-gray-800 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    />
                    <button
                      type="submit"
                      className="mt-3 sm:mt-0 sm:ml-3 lg:mt-3 lg:ml-0 xl:mt-0 xl:ml-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Subscribe
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between">
          <div className="text-base text-gray-400">
            &copy; {currentYear} Journee. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;