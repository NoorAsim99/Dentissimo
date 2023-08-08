# Team-11 Project

Dentismo is a web-based application for patients wanting to book dentist appointments, and for dentists to easily manage their bookings and breaks. 

It is a distributed system consisting of four components, a broker, a RESTful API and two databases for data persistence. 

### Component Overview

* The Booking Handler is in charge of accepting or rejecting requests from the customer to book a dentist appointment at a certain time.
It checks if the time is available, and if it is sends an acceptance message back to the front-end on a MQTT topic that the front-end subscribed to. Conversely if the time is not available it sends a rejection message in the same manner.
* The Booking Handler is also capable of cancelling an already booked time at the request of the customer throught the front-end. It does this by deleting the booking from the database.
* In the case that a customer wants to view all the bookings they have made, the booking Handler can also search the database with their credentials and return all the bookings belonging to them, which is then populated on the front-end in an appropriate user-friendly way. 

### Installation

* Install Node.js
* Install the Eclipse Mosquitto MQTT broker
* Open a terminal in the /server folder of the project and run the command `npm install`
* Run the code by either running the command `npm run dev` or `node app.js` in the server folder. Have it running while giving it input through the web page frontend.

### Template

* Adapted from template by Joel Scheuner, see included copy of license for more information
