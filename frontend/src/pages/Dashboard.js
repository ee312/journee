import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TripCard from '../components/TripCard';
//import emptyStateImage from '../assets/empty-state.svg';

const Dashboard = ({ user }) => {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    // fetch trips from the API
    // using mock data for demo
    fetchTrips();
  }, []);
  
  const fetchTrips = () => {
    // simulate API call
    setTimeout(() => {
      const mockTrips = [
        {
          id: '1',
          destination: 'Paris, France',
          startDate: '2025-06-15',
          endDate: '2025-06-22',
          status: 'upcoming',
          image: 'https://via.placeholder.com/300x200?text=Paris',
          activities: 12,
          accommodations: 'Hotel Le Marais',
        },
        {
          id: '2',
          destination: 'Tokyo, Japan',
          startDate: '2025-08-10',
          endDate: '2025-08-20',
          status: 'upcoming',
          image: 'https://via.placeholder.com/300x200?text=Tokyo',
          activities: 15,
          accommodations: 'Shibuya Hotel',
        },
        {
          id: '3',
          destination: 'Barcelona, Spain',
          startDate: '2025-04-12',
          endDate: '2025-04-18',
          status: 'completed',
          image: 'https://via.placeholder.com/300x200?text=Barcelona',
          activities: 10,
          accommodations: 'Casa Barcelona',
        },
        {
          id: '4',
          destination: 'New York, USA',
          startDate: '2025-07-22',
          endDate: '2025-07-29',
          status: 'draft',
          image: 'https://via.placeholder.com/300x200?text=New+York',
          activities: 8,
          accommodations: 'The Midtown Hotel',
        },
      ];
      
      setTrips(mockTrips);
      setIsLoading(false);
    }, 1000);
  };
  
  const filterTrips = () => {
    if (activeTab === 'all') {
      return trips;
    }
    return trips.filter(trip => trip.status === activeTab);
  };
  
  const displayedTrips = filterTrips();
  
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
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading your trips...</p>
          </div>
        ) : displayedTrips.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayedTrips.map(trip => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            {/* <img src={emptyStateImage} alt="No trips found" className="w-48 h-auto mb-6" /> */}
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
              Plan Your First Trippppppppppppppp
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;