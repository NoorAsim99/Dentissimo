# Team-11 Project

Dentismo is a web-based application for patients wanting to book dentist appointments, and for dentists to easily manage their bookings and breaks. 

It is a distributed system consisting of four components, a broker, a RESTful API and two databases for data persistence. 

### Component Overview

* The Clinic Publisher is the component in charge of accessing all the information about the dentist clinics in our database, their location, opening hours etc.
* At the request of the customer the frontend sends a message over mqtt to the Clinic Handler, which prompts it to post all the data on all the clinics in the database which the front-end can use to populate the Map with information. This communication occurs over MQTT.
* The Clinic Handler can also send the data on just one Clinic, if one is specified.

### Template

* Adapted from template by Joel Scheuner, see included copy of license for more information
