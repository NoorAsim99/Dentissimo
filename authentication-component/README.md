# Team-11 Project

Dentismo is a web-based application for patients wanting to book dentist appointments, and for dentists to easily manage their bookings and breaks. 

It is a distributed system consisting of four components, a broker, a RESTful API and two databases for data persistence. 

### Component Overview

* The Authentication Component is the RESTful API used by our front-end for user authorization. This is it's only purpose, as all other communication occurs over the MQTT broker. It stores an email and a password, which can then be accessed by the front-end via HTTP requests. 

### Template

* Adapted from template by Joel Scheuner, see included copy of license for more information
