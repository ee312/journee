import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const ItineraryView = ({ user }) => {
  const { id } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(0);
  
  useEffect(() => {
    // fetch the itinerary from the API
    fetch(`http://127.0.0.1:5050/itinerary/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setItinerary(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching itinerary:', err);
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return <div>Loading itinerary...</div>;
  }
  
  if (!itinerary) {
    return (
      <div>
        <h2>Itinerary not found</h2>
        <Link to="/profile">Back to Profile</Link>
      </div>
    );
  }
  
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
    {/*   <div className="mr-6 flex items-center">
            <i className="far fa-calendar-alt mr-1"></i>
            <span>{formatDate(itinerary.startDate)} - {formatDate(itinerary.endDate)}</span>
          </div> */}
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
                Day {day.day} {/*:  {new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} */}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Day {itinerary.days[activeDay].day} {/*: {formatDate(itinerary.days[activeDay].date)} */}
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
            {/* <div className="w-24 flex-shrink-0 text-center">
                  <div className="text-sm font-medium text-gray-900">{activity.time}</div>
                  <div className="text-xs text-gray-500">{activity.duration}</div>
                </div> */}
                <div className="flex-1 ml-4">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900">{activity.name}</h3>
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                      activity.type === 'attraction/activity' ? 'bg-purple-100 text-purple-800' :
                      activity.type === 'restaurant' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {activity.type === 'attraction/activity' ? 'Attraction/Activity' :
                       activity.type === 'restaurant' ? 'Restaurant' : 'Activity'}
                    </span>
                  </div>
                  
            {/*   <div className="mt-1 text-sm text-gray-600">
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
                  </div> */}
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