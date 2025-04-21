import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NewTrip = ({ user }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    destination: '',
    specificDestination: false,
    startDate: '',
    endDate: '',
    
    // Step 2: Preferences
    budget: '$$',
    interests: [],
    languagePreference: 'english',
    specialRequests: '',
  });
  
  const interestOptions = [
    'Amusement Parks',
    'Outdoors',
    'Spa Day',
    'Art',
    'Museum', 
    'Bowling',
    'Shopping',
    'Working Out',
    'Zoo',
    'History Buff',
    'going out for drinks',
    'Touristy',
    'Gamble',
    'Books',
    'Sports',
    'Aquariums',
    'Movies',
  ];
  
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'interests') {
        const updatedInterests = [...formData.interests];
        if (checked) {
          updatedInterests.push(value);
        } else {
          const index = updatedInterests.indexOf(value);
          if (index > -1) {
            updatedInterests.splice(index, 1);
          }
        }
        setFormData({ ...formData, interests: updatedInterests });
      } else {
        setFormData({ ...formData, [name]: checked });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
    window.scrollTo(0, 0);
  };
  
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };
  
  const handleGenerateItinerary = () => {
    setIsGenerating(true);
    
    // make API call to generate itinerary
    // simulate generation for demo
    setTimeout(() => {
      navigate('/itinerary/new-trip-123');
    }, 3000);
  };
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Plan Your Trip</h2>
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
            Step {currentStep} of 3
          </span>
        </div>
        
        <div className="mt-3">
          <div className="relative">
            <div className="overflow-hidden h-2 flex rounded bg-gray-200">
              <div
                style={{ width: `${(currentStep / 3) * 100}%` }}
                className="shadow-none flex flex-col justify-center bg-blue-600"
              ></div>
            </div>
            <div className="flex text-xs text-gray-600 mt-2 justify-between">
              <div className={`${currentStep >= 1 ? 'text-blue-600 font-medium' : ''}`}>Basic Info</div>
              <div className={`${currentStep >= 2 ? 'text-blue-600 font-medium' : ''}`}>Preferences</div>
              <div className={`${currentStep >= 3 ? 'text-blue-600 font-medium' : ''}`}>Additional Info</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 p-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Basic Trip Information</h3>
              <p className="text-sm text-gray-600">Let's start with the essential details of your trip.</p>
              
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Do you have a specific destination in mind?
                  </label>
                  <div className="relative inline-block w-12 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      name="specificDestination"
                      id="specificDestination"
                      checked={formData.specificDestination}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <label
                      htmlFor="specificDestination"
                      className={`block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${
                        formData.specificDestination ? 'bg-blue-600' : ''
                      }`}
                    >
                      <span
                        className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${
                          formData.specificDestination ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      ></span>
                    </label>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {formData.specificDestination ? 'Yes' : 'No, recommend me a destination'}
                </span>
              </div>
              
              {formData.specificDestination && (
                <div>
                  <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
                    Destination
                  </label>
                  <input
                    type="text"
                    id="destination"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder="e.g., Paris, France"
                    required={formData.specificDestination}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="travelers" className="block text-sm font-medium text-gray-700">
                  Number of Travelers
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <button
                    type="button"
                    onClick={() => {
                      if (formData.travelers > 1) {
                        setFormData({ ...formData, travelers: formData.travelers - 1 });
                      }
                    }}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-l-md text-gray-700 bg-gray-50 hover:bg-gray-100"
                  >
                    <span className="sr-only">Decrease</span>
                    <i className="fas fa-minus"></i>
                  </button>
                  <input
                    type="number"
                    id="travelers"
                    name="travelers"
                    value={formData.travelers}
                    onChange={handleChange}
                    min="1"
                    max="20"
                    required
                    className="flex-1 block w-full rounded-none border-y border-gray-300 py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-center"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, travelers: formData.travelers + 1 });
                    }}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100"
                  >
                    <span className="sr-only">Increase</span>
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Next: Preferences <i className="fas fa-arrow-right ml-2"></i>
                </button>
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Trip Preferences</h3>
              <p className="text-sm text-gray-600">Help us understand your travel style and interests.</p>
              
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                  Budget Level
                </label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="budget">$</option>
                  <option value="medium">$$</option>
                  <option value="luxury">$$$</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="accommodation" className="block text-sm font-medium text-gray-700">
                  Preferred Accommodation
                </label>
                <select
                  id="accommodation"
                  name="accommodation"
                  value={formData.accommodation}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700 mb-1">
                  Activity Level
                </label>
                <input
                  type="range"
                  id="activityLevel"
                  name="activityLevel"
                  min="1"
                  max="3"
                  step="1"
                  value={
                    formData.activityLevel === 'relaxed' ? 1 :
                    formData.activityLevel === 'moderate' ? 2 : 3
                  }
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setFormData({
                      ...formData,
                      activityLevel: val === 1 ? 'relaxed' :
                                     val === 2 ? 'moderate' : 'active'
                    });
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>Relaxed</span>
                  <span>Moderate</span>
                  <span>Active</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interests (Select all that apply)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {interestOptions.map((interest) => (
                    <div key={interest} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`interest-${interest}`}
                        name="interests"
                        value={interest}
                        checked={formData.interests.includes(interest)}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`interest-${interest}`} className="ml-2 block text-sm text-gray-700">
                        {interest}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <i className="fas fa-arrow-left mr-2"></i> Back
                </button>
                
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Next: Additional Info <i className="fas fa-arrow-right ml-2"></i>
                </button>
              </div>
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Additional Information</h3>
              <p className="text-sm text-gray-600">These details help us personalize your itinerary even more.</p>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dietary Restrictions (Select all that apply)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {dietaryOptions.map((dietary) => (
                    <div key={dietary} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`dietary-${dietary}`}
                        name="dietaryRestrictions"
                        value={dietary}
                        checked={formData.dietaryRestrictions.includes(dietary)}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`dietary-${dietary}`} className="ml-2 block text-sm text-gray-700">
                        {dietary}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Accessibility Needs (Select all that apply)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {accessibilityOptions.map((accessibility) => (
                    <div key={accessibility} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`accessibility-${accessibility}`}
                        name="accessibilityNeeds"
                        value={accessibility}
                        checked={formData.accessibilityNeeds.includes(accessibility)}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`accessibility-${accessibility}`} className="ml-2 block text-sm text-gray-700">
                        {accessibility}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label htmlFor="languagePreference" className="block text-sm font-medium text-gray-700">
                  Preferred Language
                </label>
                <select
                  id="languagePreference"
                  name="languagePreference"
                  value={formData.languagePreference}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="german">German</option>
                  <option value="italian">Italian</option>
                  <option value="japanese">Japanese</option>
                  <option value="mandarin">Mandarin</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700">
                  Special Requests or Additional Information
                </label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  placeholder="Any other preferences or details we should know?"
                  rows="4"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                ></textarea>
              </div>
              
              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <i className="fas fa-arrow-left mr-2"></i> Back
                </button>
                
                <button
                  type="button"
                  onClick={handleGenerateItinerary}
                  disabled={isGenerating}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating Itinerary...
                    </>
                  ) : (
                    <>Generate Itinerary</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 p-6">
          <div className="sticky top-24">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Trip Summary</h3>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-500">Destination</div>
                <div className="mt-1 text-sm text-gray-900">
                  {formData.specificDestination 
                    ? formData.destination || 'Not specified' 
                    : 'To be recommended'}
                </div>
              </div>
              
              {formData.startDate && formData.endDate && (
                <div>
                  <div className="text-sm font-medium text-gray-500">Dates</div>
                  <div className="mt-1 text-sm text-gray-900">
                    {new Date(formData.startDate).toLocaleDateString()} - {new Date(formData.endDate).toLocaleDateString()}
                  </div>
                </div>
              )}
              
              <div>
                <div className="text-sm font-medium text-gray-500">Travelers</div>
                <div className="mt-1 text-sm text-gray-900">{formData.travelers}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-500">Budget</div>
                <div className="mt-1 text-sm text-gray-900">
                  {formData.budget === 'budget' && 'Budget/Backpacker'}
                  {formData.budget === 'medium' && 'Mid-Range'}
                  {formData.budget === 'luxury' && 'Luxury'}
                </div>
              </div>
              
              {formData.interests.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-gray-500">Interests</div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {formData.interests.map((interest, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewTrip;