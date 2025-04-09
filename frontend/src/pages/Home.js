import React from 'react';
import { Link } from 'react-router-dom';
import suitcase from '../assets/suitcase.svg';
import featureIcon1 from '../assets/feature-icon1.png';
import featureIcon2 from '../assets/feature-icon2.png';
import featureIcon3 from '../assets/feature-icon3.png';

const Home = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                Your personalized travel itinerary awaits
              </h1>
              <p className="mt-4 text-lg text-gray-600 md:text-xl">
                Create custom travel plans based on your preferences with our AI-powered itinerary generator.
                Stop spending hours researching - let us help you plan the perfect trip.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="flex items-center justify-center px-6 py-3 rounded-md shadow-md bg-blue-600 text-white text-base font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="flex items-center justify-center px-6 py-3 rounded-md shadow-md bg-white text-blue-600 text-base font-medium border border-blue-600 hover:bg-blue-50 transition-colors duration-200"
                >
                  Sign In
                </Link>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:col-span-6 xl:col-span-7">
              <div className="relative rounded-lg shadow-xl overflow-hidden">
                <img
                  className="w-full h-auto"
                  src={suitcase}
                  alt="Travel Planning"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              How Journee Works
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="flex justify-center">
                <img src={featureIcon1} alt="Input Preferences" className="h-20 w-20" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-900">Input Your Preferences</h3>
              <p className="mt-2 text-base text-gray-600">
                Tell us about your travel style, budget, group size, and interests.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center">
              <div className="flex justify-center">
                <img src={featureIcon2} alt="AI Recommendations" className="h-20 w-25" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-900">AI Generates Recommendations</h3>
              <p className="mt-2 text-base text-gray-600">
                Our smart system creates a personalized itinerary just for you.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center">
              <div className="flex justify-center">
                <img src={featureIcon3} alt="Explore and Edit" className="h-20 w-20" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-900">Explore and Edit</h3>
              <p className="mt-2 text-base text-gray-600">
                Review your itinerary, make changes, and save for your trip.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              What Our Travelers Say
            </h2>
          </div>
          
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600 italic">
                "Journee saved me hours of research for my trip to Paris. The recommendations were spot-on!"
              </p>
              <div className="mt-4 font-medium text-gray-900">- Emily E.</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600 italic">
                "I loved how easy it was to customize my itinerary based on my budget constraints. Great app!"
              </p>
              <div className="mt-4 font-medium text-gray-900">- Mofe T.</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600 italic">
                "Planning a family trip was so much easier with Journee. Everyone's preferences were considered!"
              </p>
              <div className="mt-4 font-medium text-gray-900">- Andreea T.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to plan your next adventure?
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Sign up today and create your first custom itinerary in minutes.
          </p>
          <div className="mt-8">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-3 rounded-md shadow-lg bg-white text-blue-600 text-base font-medium hover:bg-gray-50"
            >
              Get Started For Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;