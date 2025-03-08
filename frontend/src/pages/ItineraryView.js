import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const ItineraryView = ({ user }) => {
  const { id } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(0);
  
  useEffect(() => {
    // In a real application, you would fetch the itinerary from the API
    // For demo purposes, we'll use mock data
    fetchItinerary();
  }, [id]);
  
  const fetchItinerary = () => {
    // Simulate API call
    setTimeout(() => {
      const mockItinerary = {
        id,
        destination: 'Paris, France',
        startDate: '2025-06-15',
        endDate: '2025-06-22',
        status: 'upcoming',
        accommodation: 'Hotel Le Marais',
        days: [
          {
            day: 1,
            date: '2025-06-15',
            activities: [
              {
                id: '1',
                time: '09:00 AM',
                name: 'Eiffel Tower Visit',
                type: 'attraction',
                duration: '2 hours',
                location: 'Champ de Mars, 5 Avenue Anatole France',
                notes: 'Book tickets in advance to avoid long lines',
              },
              {
                id: '2',
                time: '12:00 PM',
                name: 'Lunch at Café de Flore',
                type: 'restaurant',
                duration: '1.5 hours',
                location: '172 Boulevard Saint-Germain',
                notes: 'Famous historic café, try their croque monsieur',
              },
              {
                id: '3',
                time: '02:00 PM',
                name: 'Louvre Museum',
                type: 'attraction',
                duration: '3 hours',
                location: 'Rue de Rivoli',
                notes: 'Focus on main attractions like Mona Lisa if time is limited',
              },
              {
                id: '4',
                time: '06:00 PM',
                name: 'Seine River Cruise',
                type: 'activity',
                duration: '1 hour',
                location: 'Pont de l\'Alma',
                notes: 'Sunset cruise recommended for best views',
              },
              {
                id: '5',
                time: '08:00 PM',
                name: 'Dinner at Le Jules Verne',
                type: 'restaurant',
                duration: '2 hours',
                location: 'Eiffel Tower, 2nd Floor',
                notes: 'Reservation required well in advance',
              },
            ],
          },
          {
            day: 2,
            date: '2025-06-16',
            activities: [
              {
                id: '6',
                time: '09:30 AM',
                name: 'Notre-Dame Cathedral',
                type: 'attraction',
                duration: '1.5 hours',
                location: 'Parvis Notre-Dame',
                notes: 'Visit the exterior and nearby areas',
              },
              {
                id: '7',
                time: '11:30 AM',
                name: 'Latin Quarter Walking Tour',
                type: 'activity',
                duration: '2 hours',
                location: 'Starting at Place Saint-Michel',
                notes: 'Guided tour recommended for historical context',
              },
            ],
          },
          // additional days added here
        ],
      };
      
      setItinerary(mockItinerary);
      setIsLoading(false);
    }, 1000);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="ml-3 text-gray-600">Loading itinerary...</p>
      </div>
    );
  }
  
  if (!itinerary) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Itinerary not found</h2>
        <p className="mt-2 text-gray-600">The itinerary you're looking for doesn't exist or has been deleted.</p>
        <Link to="/dashboard" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
          Back to Dashboard
        </Link>
      </div>
    );
  }
  
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="bg-blue-600 text-white px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{itinerary.destination}</h1>
          <div className="flex space-x-3">
            <button className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-blue-50">
              <i className="fas fa-edit mr-1"></i> Edit
            </button>
            <button className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-blue-50">
              <i className="fas fa-download mr-1"></i> Export
            </button>
            <button className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-blue-50">
              <i className="fas fa-share-alt mr-1"></i> Share
            </button>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap items-center text-blue-100 text-sm">
          <div className="mr-6 flex items-center">
            <i className="far fa-calendar-alt mr-1"></i>
            <span>{formatDate(itinerary.startDate)} - {formatDate(itinerary.endDate)}</span>
          </div>
          <div className="mr-6 flex items-center">
            <i className="fas fa-bed mr-1"></i>
            <span>{itinerary.accommodation}</span>
          </div>
          <div className="flex items-center">
            <i className="fas fa-map-marked-alt mr-1"></i>
            <span>{itinerary.days.length} days planned</span>
          </div>
        </div>
      </div>
      
      <div className="flex border-b border-gray-200">
        <div className="w-64 border-r border-gray-200 p-4 bg-gray-50">
          <h2 className="font-medium text-gray-900 mb-3">Trip Days</h2>
          <div className="space-y-2">
            {itinerary.days.map((day, index) => (
              <button
                key={day.day}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  activeDay === index
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveDay(index)}
              >
                Day {day.day}: {new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Day {itinerary.days[activeDay].day}: {formatDate(itinerary.days[activeDay].date)}
            </h2>
            <div className="flex space-x-2">
              <button 
                className="px-2 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                disabled={activeDay === 0}
                onClick={() => setActiveDay(activeDay - 1)}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <button 
                className="px-2 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                disabled={activeDay === itinerary.days.length - 1}
                onClick={() => setActiveDay(activeDay + 1)}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
          
          <div className="space-y-6">
            {itinerary.days[activeDay].activities.map((activity) => (
              <div key={activity.id} className="flex border-l-4 border-blue-500 bg-white rounded-r-md shadow-sm p-4">
                <div className="w-24 flex-shrink-0 text-center">
                  <div className="text-sm font-medium text-gray-900">{activity.time}</div>
                  <div className="text-xs text-gray-500">{activity.duration}</div>
                </div>
                
                <div className="flex-1 ml-4">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900">{activity.name}</h3>
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                      activity.type === 'attraction' ? 'bg-purple-100 text-purple-800' :
                      activity.type === 'restaurant' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {activity.type === 'attraction' ? 'Attraction' :
                       activity.type === 'restaurant' ? 'Restaurant' : 'Activity'}
                    </span>
                  </div>
                  
                  <div className="mt-1 text-sm text-gray-600">
                    <div className="flex items-center mb-1">
                      <i className="fas fa-map-marker-alt text-gray-400 mr-1"></i>
                      <span>{activity.location}</span>
                    </div>
                    
                    {activity.notes && (
                      <div className="flex items-start mt-2">
                        <i className="fas fa-info-circle text-gray-400 mr-1 mt-0.5"></i>
                        <span>{activity.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="ml-4 flex-shrink-0">
                  <button className="text-gray-400 hover:text-gray-600">
                    <i className="fas fa-ellipsis-v"></i>
                  </button>
                </div>
              </div>
            ))}
            
            <button className="w-full flex justify-center items-center py-3 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-gray-400 hover:text-gray-800">
              <i className="fas fa-plus mr-2"></i> Add Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryView;