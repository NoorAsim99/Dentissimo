var mongoose = require('mongoose');
var Timeslot = require('./models/timeslot'); //Moving controller into app.js, need the model
var timeslots = require('./controllers/timeslots')
const mqtt = require('mqtt');
const CircuitBreaker = require('opossum'); //We are using the opposum library to get access to a circuit breaker
const breakerOptions = {   //Here we need to declare some options for the breaker.
    timeout: 3000,  //How long can a request take before it is considered failed. Set to 3 seconds.
    errorThresholdPercentage: 80, //errorThresholdPercentag is the percentile of requests that can fail before the circuit fires.
    resetTimeout: 30000 ////this specifies how long the circuit remains open after it fires. It is set to 30 seconds.
};

const host = 'xba005c0.eu-central-1.emqx.cloud'
const mqttport = '15425'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `mqtt://${host}:${mqttport}`

const mqttClient = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: 'dentistimo',
    password: 'Team11GU',
    reconnectPeriod: 1000,
  })

  /*
const options = {
    host: 'mqtt://xba005c0.eu-central-1.emqx.cloud:15425',
    clientId: 'emqx_test',
    username: 'dentistimo',
    password: 'Team11GU'
};

//const mqttClient = mqtt.connect('mqtt://localhost:1883') //If you would like to run mqtt on localhost for testing, use this instead of line below.
const mqttClient = mqtt.connect(options)
*/
mqttClient.on('connect', function () {
    console.log('Connected')
    mqttClient.subscribe('bookinghandler/#', { qos: 1 }, function (err) {
        if (!err) {
            console.log('I subbed')
        }
    })
})

mqttClient.on('message', function (topic, payload) {



    if (topic == 'bookinghandler/requestBooking') { //Gets passed a request for a dentist appointment at a specific time date and clinic and either accepts and inserts it into the database or rejects the request. 
        var bookingInfo = JSON.parse(payload.toString()) //We receive JSON docs converted to strings over mqtt, and here we convert them back into JSON docs. 
        const breaker = new CircuitBreaker(timeslots.requestBooking(mqttClient, bookingInfo), breakerOptions); //We wrap all our functions in circuit breakers.
        breaker.fire().then(console.log).catch(console.error); //To execute the function we call this method. Now the breaker can keep track of successes and failures, determined by the timeout and the Promise returned from the function.
        breaker.fallback(() => mqttClient.publish('frontend/bookingapproval', 'Over capacity, please try again later')); //When the circuit is open we fallback to sending this message to the frontend.
        breaker.on('open', () =>{console.log('Breaker open')})
    } else if (topic == 'bookinghandler/allbookings') { //Sends all bookings currently in the database
        var bookingInfo = JSON.parse(payload.toString())
        const breaker = new CircuitBreaker(timeslots.getAllBookings(mqttClient, bookingInfo), breakerOptions);
        breaker.fire().then(console.log).catch(console.error);
        breaker.fallback(() => mqttClient.publish('frontend/bookingapproval', 'Over capacity, please try again later'));
    } else if (topic == 'bookinghandler/patientbooking') { //Sends all bookings for a specific patient
        var bookingInfo = JSON.parse(payload.toString())
        const breaker = new CircuitBreaker(timeslots.getPatientBooking(mqttClient, bookingInfo), breakerOptions);
        breaker.fire().then(console.log).catch(console.error);
        breaker.fallback(() => mqttClient.publish('frontend/bookingapproval', 'Over capacity, please try again later'));
    } else if (topic == 'bookinghandler/datebooking') { //Sends all bookings at a specified date
        var bookingInfo = JSON.parse(payload.toString())
        const breaker = new CircuitBreaker(timeslots.getDateBooking(mqttClient, bookingInfo), breakerOptions);
        breaker.fire().then(console.log).catch(console.error);
        breaker.fallback(() => mqttClient.publish('frontend/bookingapproval', 'Over capacity, please try again later'));
    } else if (topic == 'bookinghandler/deletebooking') { //Deletes a specific booking from the database
        // var bookingInfo = JSON.parse(payload.toString())
        const breaker = new CircuitBreaker(timeslots.deleteBooking(mqttClient, payload), breakerOptions);
        breaker.fire().then(console.log).catch(console.error);
        breaker.fallback(() => mqttClient.publish('frontend/bookingapproval', 'Over capacity, please try again later'));
    }else {
        console.log(bookingInfo)
    }
})

// Variables
var mongoURI = process.env.MONGODB_URI || 'mongodb+srv://dbcomp:VZG0Qruv6jCQFrqw@cluster0.whbcc.mongodb.net/cluster0?retryWrites=true&w=majority';
var port = process.env.PORT || 50000;

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
    if (err) {
        console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`);
        console.error(err.stack);
        process.exit(1);
    }
    console.log(`Connected to MongoDB with URI: ${mongoURI}`);
});