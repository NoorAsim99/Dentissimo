# Team-11 Project

Dentismo is a web-based application for patients wanting to book dentist appointments, and for dentists to easily manage their bookings and breaks. 

It is a distributed system consisting of four components, a broker, a RESTful API and two databases for data persistence. 

### Components

* Front-end: A reactive web page built with Express.js and Vue.js. This is the user interface of the application, and handles everything the user interacts with and sees.
* RESTful API: Connected to the Front-end we have a RESTful API we use for user authentication, with HTTP requests against a database containing our registered users. This is it’s only purpose.
* Booking Handler: This component handles booking appointments. It receives requests for bookings, checks their availability, and confirms or rejects bookings. It also sends a list of available times to populate the front-end map and calendar. All communication between the Booking Handler and other components will be through the intermediary of the MQTT broker.
* Fika Handler: A component that handles functions specific to Dentists using the system. It handles requests for fika breaks. All communication between the Fika Handler and other components will be through the intermediary of the MQTT broker.
* Database Handler: This component receives requests from the Booking Handler and the Fika Handler over the MQTT broker. It can check in its database if a time is available for booking and communicate booking acceptance or rejection back to the booking handler. It can persist accepted bookings in it’s database. It can persist Fika breaks for the Fika handler. All communication between the Database Handler and other components will be through the intermediary of the MQTT broker.
