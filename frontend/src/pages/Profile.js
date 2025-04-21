import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'

// const Profile = ({ user, setUser }) => {
const Profile = () => {
  // const [activeTab, setActiveTab] = useState('personal');
  // const [isEditing, setIsEditing] = useState(false);

  // get user data from flask on load
  const [itineraries, setItineraries] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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
          const now = new Date();
          const pastTrips = (data.itineraries || data.trips || []).filter((trip) =>
            new Date(trip.endDate) < now
          );
          setItineraries(pastTrips);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError('Could not retrieve profile data.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading your past trips...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (itineraries.length === 0) return <div>No past itineraries found.</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Past Trips</h2>
      {itineraries.map((trip) => (
        <div key={trip._id} className="mb-4 border p-4 rounded shadow">
          <h3 className="text-xl font-semibold">{trip.destination}</h3>
          <p className="text-gray-600">
            {trip.startDate} – {trip.endDate}
          </p>
          <Link to={`/itinerary/${trip._id}`} className="text-blue-600 underline">
            View Full Itinerary
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Profile;