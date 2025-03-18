# Journee Itinerary Planner

Planning trips can be very stressful and time-consuming because there is just so much research involved. This project makes travel planning effortless by using AI to create custom itineraries that match the users’ unique needs, preferences, and budget. It will make travel easier and more enjoyable. 

For our tech stack, we use React.js for our front-end, Flask for our back-end, and MongoDB for our database. We use a travel API, Google Places API, which includes food, stay, and things to do. We use this along with Surprise Library, our AI model of choice.

---

# how our project works
We use a three-tier architecture. We also use dot_env to secure our MonogDB URI, and some security imports as well for password security.

A little bit about how our project is structured: 


**Front-end (top tier)**

* Sends API request to back-end mediator 

* Uses websocket to update generated itinerary 

* Displays final itinerary on user page 


**Back-end Mediator (middle tier)**

* Accepts incoming requests
 
* Handle authentication

* Assign each request unique tracking ID

* fetch data (call API) 

* incorporate AI (use Surprise to generate trip) 

*final assembly (combine all data) 

* Return final itinerary back to front-end 

 

**Data Tier (bottom tier)**

* Fetch data  

  * Google Places API 

  * MongoDB 

* Send data to backend mediator 
