# Team-11 Project

Dentismo is a web-based application for patients wanting to book dentist appointments, and for dentists to easily manage their bookings and breaks. 

It is a distributed system consisting of four components, a broker, a RESTful API and two databases for data persistence. 

### Component Overview

* The Fika Handler is in charge of handling and validating requests for Fika and Lunch breaks by dentists. If a Fika or Lunch request overlaps with an already booked appointment it will reject the request, otherwise it will accept it. Communication with the front-end occurs with MQTT messages. 

### Template

* Adapted from template by Joel Scheuner, see included copy of license for more information
