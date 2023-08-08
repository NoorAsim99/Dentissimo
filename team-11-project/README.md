# Team-11 Project

Dentismo is a web-based application for patients wanting to book dentist appointments easily online, and for dentists to simply manage their bookings and breaks. 

It is a distributed system consisting of four components, a broker, a RESTful API and two databases for data persistence. 

**GUI component is one of them which will be briefly explained here.**

### Component Overview :

- This is a web-based front-end which patients and dentists can use to interact with our software functionalities. It is a Node.js, Express.js and Vue.js based website.

- It communicates with the other components of the distributed system over an MQTT broker.

- Sign up / Log in for authentication purpose , so only verified users can access the web application , entered credentials utilize the cookies to verify the user on subsequent visits through our web application pages, also used to differentiate between patients and dentists.

- It uses the Google Maps JavaScript API to present an interactive map of Gothenburg to our patients, with markers denoting the location of all the dentist clinics in our system(All the clinic information displayed), as well as booking component interface that shows available timeslots for the selected clinic, and book an appointment.


- Sidebar which provides an option for the dentist to select his break type , along with choosing the available timeslot for it.

- Sidebar which provides an option for the patient to manage their appointment (viewing their upcoming appointment's details), also being able to cancel unwanted appointment(s)


### How to run :
1. Download [MQTT-broker](https://mosquitto.org/download/)
1. Open the Mosquitto configuration file 
1. Add Websockets & listener
1. Reboot the broker
1. Navigate to the Client folder in the Frontend repository
1. Open terminal and run "npm install"
1. Then npm install other dependencies "npm install vue2-google-maps" , "vue2-gmap-custom-marker" and "npm install vue mqtt"
1. Afterwards run "npm run serve"
1. Follow this link http://localhost:8080/ to open our Dentistimo GUI
 
 ### Template

 * Adapted from template by Joel Scheuner, see included copy of license for more information
