import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TripCard from '../components/TripCard';

const Profile = () => {
  const [itineraries, setItineraries] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("log in.");
      setLoading(false);
      return;
    }

    fetch('http://127.0.0.1:5050/userpage', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setError(data.message);
        } else {
          const allTrips = data.itineraries || data.trips || [];
          setItineraries(allTrips);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError('Could not retrieve profile data.');
        setLoading(false);
      });
  }, []);

  const filterTrips = () => {
    if (activeTab === 'all') {
      return itineraries;
    } else if (activeTab === 'completed') {
      const now = new Date();
      return itineraries.filter((trip) => new Date(trip.endDate) < now);
    } else if (activeTab === 'upcoming') {
      const now = new Date();
      return itineraries.filter((trip) => new Date(trip.endDate) >= now);
    } else if (activeTab === 'draft') {
      // If you have a status field for drafts, use it here
      return itineraries.filter((trip) => trip.status === 'draft');
    }
    return itineraries;
  };

  const displayedTrips = filterTrips();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading your trips...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="bg-gray-50 rounded-lg shadow">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Trips</h1>
          <Link 
            to="/new-trip" 
            className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <i className="fas fa-plus mr-2"></i> Plan New Trip
          </Link>
        </div>

        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('all')}
              className={`${
                activeTab === 'all'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              All Trips
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`${
                activeTab === 'upcoming'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`${
                activeTab === 'completed'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Completed
            </button>
            <button
              onClick={() => setActiveTab('draft')}
              className={`${
                activeTab === 'draft'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Drafts
            </button>
          </nav>
        </div>

        {displayedTrips.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayedTrips.map((trip) => (
              <TripCard 
                key={trip._id} 
                trip={{
                  id: trip._id,
                  destination: trip.destination,
                  startDate: trip.startDate,
                  endDate: trip.endDate,
                  status: trip.status || (new Date(trip.endDate) < new Date() ? 'completed' : 'upcoming'),
                  image: `https://via.placeholder.com/300x200?text=${encodeURIComponent(trip.destination)}`,
                  activities: trip.itinerary?.days?.length || 0,
                  accommodations: trip.itinerary?.hotel?.displayName?.text || 'Not specified'
                }} 
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No trips found</h3>
            <p className="mt-2 text-gray-600">
              {activeTab === 'all'
                ? "You haven't created any trips yet."
                : activeTab === 'upcoming'
                ? "You don't have any upcoming trips."
                : activeTab === 'completed'
                ? "You don't have any completed trips."
                : "You don't have any trip drafts."}
            </p>
            <Link
              to="/new-trip"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Plan Your First Trip
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;