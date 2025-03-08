import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const TripCard = ({ trip }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 'upcoming':
        return 'Upcoming';
      case 'completed':
        return 'Completed';
      case 'draft':
        return 'Draft';
      default:
        return 'Unknown';
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="bg-white overflow-hidden shadow-sm rounded-lg transition-shadow hover:shadow-md">
      <div className="relative">
        <img 
          src={trip.image}
          alt={trip.destination}
          className="w-full h-48 object-cover"
        />
        <span className={`absolute top-3 right-3 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(trip.status)}`}>
          {getStatusLabel(trip.status)}
        </span>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{trip.destination}</h3>
        
        <div className="mt-2 flex items-center text-sm text-gray-600">
          <i className="far fa-calendar-alt mr-2"></i>
          <span>
            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
          </span>
        </div>
        
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="flex items-center text-sm text-gray-600">
            <i className="fas fa-map-marker-alt mr-2"></i>
            <span>{trip.activities} Activities</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <i className="fas fa-bed mr-2"></i>
            <span className="truncate">{trip.accommodations}</span>
          </div>
        </div>
      </div>
      
      <div className="px-4 py-3 bg-gray-50 flex justify-between items-center">
        <Link 
          to={`/itinerary/${trip.id}`} 
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          {trip.status === 'draft' ? 'Continue Planning' : 'View Itinerary'}
        </Link>
        
        <div className="relative">
          <button
            type="button"
            className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-white hover:bg-gray-100"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <i className="fas fa-ellipsis-v text-gray-600"></i>
          </button>
          
          {showDropdown && (
            <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
              <div className="py-1" role="menu" aria-orientation="vertical">
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowDropdown(false)}
                >
                  <i className="fas fa-edit mr-2"></i> Edit
                </button>
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowDropdown(false)}
                >
                  <i className="fas fa-clone mr-2"></i> Duplicate
                </button>
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  onClick={() => setShowDropdown(false)}
                >
                  <i className="fas fa-trash-alt mr-2"></i> Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripCard;