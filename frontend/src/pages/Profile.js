import React, { useEffect, useState } from 'react';

const Profile = ({ user, setUser }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);

// andreea added this in!

  // get user data from flask on load
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("log in.");
      setLoading(false);
      return;
    }

    fetch("http://localhost:5000/userpage", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setError(data.message);
        } else {
          // Update user state
          setUser(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("could not get user data.");
        setLoading(false);
      });
  }, [setUser]);

// end of andreea's edit

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    preferences: {
      accommodationType: user?.preferences?.accommodationType || 'hotel',
      budget: user?.preferences?.budget || 'medium',
      travelStyle: user?.preferences?.travelStyle || 'balanced',
      interests: user?.preferences?.interests || []
    }
  });
  
  // const interestOptions = [
  //   'Art & Culture',
  //   'Food & Dining',
  //   'Nature & Outdoors',
  //   'History & Heritage',
  //   'Shopping',
  //   'Adventure & Sports',
  //   'Relaxation & Wellness',
  //   'Nightlife & Entertainment',
  //   'Family Friendly',
  //   'Local Experiences',
  // ];

  useEffect(() => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      bio: user?.bio || "",
      preferences: {
        accommodationType: user?.preferences?.accommodationType || "hotel",
        budget: user?.preferences?.budget || "medium",
        travelStyle: user?.preferences?.travelStyle || "balanced",
        interests: user?.preferences?.interests || [],
      },
    });
  }, [user]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // const handleInterestChange = (interest) => {
  //   const currentInterests = [...formData.preferences.interests];
  //   if (currentInterests.includes(interest)) {
  //     const updatedInterests = currentInterests.filter(item => item !== interest);
  //     setFormData({
  //       ...formData,
  //       preferences: {
  //         ...formData.preferences,
  //         interests: updatedInterests
  //       }
  //     });
  //   } else {
  //     setFormData({
  //       ...formData,
  //       preferences: {
  //         ...formData.preferences,
  //         interests: [...currentInterests, interest]
  //       }
  //     });
  //   }
  // };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/userpage", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "User updated successfully") {
          setUser(formData);
          setIsEditing(false);
        } else {
          setError(data.message);
        }
      })
      .catch(() => setError("Failed to update profile."));
  };
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-16 relative">
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center px-3 py-1.5 border border-white rounded-md text-sm font-medium text-white hover:bg-blue-700"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
        
        <div className="flex items-center">
          <div className="h-24 w-24 rounded-full bg-white p-1">
            <img
              src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`}
              alt="User avatar"
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <div className="ml-6">
            <h1 className="text-2xl font-bold text-white">{user?.name || 'User'}</h1>
            <p className="text-blue-100">Member since {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('personal')}
            className={`${
              activeTab === 'personal'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm sm:text-base`}
          >
            Personal Information
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`${
              activeTab === 'preferences'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm sm:text-base`}
          >
            Travel Preferences
          </button>
        </nav>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit}>
          {activeTab === 'personal' && (
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`mt-1 block w-full rounded-md ${
                    isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                  } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`mt-1 block w-full rounded-md ${
                    isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                  } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`mt-1 block w-full rounded-md ${
                    isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                  } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                />
              </div>
              
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  About Me
                </label>
                <textarea
                  name="bio"
                  id="bio"
                  rows="4"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`mt-1 block w-full rounded-md ${
                    isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                  } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                  placeholder={isEditing ? "Tell us a bit about yourself and your travel experience..." : ""}
                ></textarea>
              </div>
            </div>
          )}
          
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div>
                <label htmlFor="preferences.accommodationType" className="block text-sm font-medium text-gray-700">
                  Preferred Accommodation
                </label>
                <select
                  name="preferences.accommodationType"
                  id="preferences.accommodationType"
                  value={formData.preferences.accommodationType}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`mt-1 block w-full rounded-md ${
                    isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                  } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                >
                  <option value="hostel">Hostel/Backpacker</option>
                  <option value="budget">Budget Hotel</option>
                  <option value="hotel">Mid-Range Hotel</option>
                  <option value="luxury">Luxury Hotel</option>
                  <option value="resort">Resort</option>
                  <option value="rental">Vacation Rental</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="preferences.budget" className="block text-sm font-medium text-gray-700">
                  Budget Level
                </label>
                <select
                  name="preferences.budget"
                  id="preferences.budget"
                  value={formData.preferences.budget}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`mt-1 block w-full rounded-md ${
                    isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                  } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                >
                  <option value="budget">Budget/Backpacker</option>
                  <option value="medium">Mid-Range</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="preferences.travelStyle" className="block text-sm font-medium text-gray-700">
                  Travel Style
                </label>
                <select
                  name="preferences.travelStyle"
                  id="preferences.travelStyle"
                  value={formData.preferences.travelStyle}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`mt-1 block w-full rounded-md ${
                    isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                  } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                >
                  <option value="relaxed">Relaxed & Slow-Paced</option>
                  <option value="balanced">Balanced Mix</option>
                  <option value="active">Active & Fast-Paced</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Travel Interests
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {interestOptions.map((interest) => (
                    <div key={interest} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`interest-${interest}`}
                        checked={formData.preferences.interests.includes(interest)}
                        onChange={() => handleInterestChange(interest)}
                        disabled={!isEditing}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`interest-${interest}`} className="ml-2 block text-sm text-gray-700">
                        {interest}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {isEditing && (
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;