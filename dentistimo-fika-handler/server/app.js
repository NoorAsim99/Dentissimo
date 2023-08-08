var express = require('express');
var mongoose = require('mongoose');
var morgan = require('morgan');
var path = require('path');
var cors = require('cors');
var history = require('connect-history-api-fallback');
const CircuitBreaker = require('opossum'); //We are using the opposum library to get access to a circuit breaker
const breakerOptions = {   //Here we need to declare some options for the breaker.
    timeout: 3000,  //How long can a request take before it is considered failed. Set to 3 seconds.
    errorThresholdPercentage: 1, //errorThresholdPercentag is the percentile of requests that can fail before the circuit fires.
    resetTimeout: 30000 ////this specifies how long the circuit remains open after it fires. It is set to 30 seconds.
};

//controller add here
const lunchBreakContoller = require ('./controllers/lunchbreaks')
const fikaBreakController = require('./controllers/fikabreaks')
const mqtt = require('mqtt');
const { json } = require('body-parser');

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
mqttClient.on('connect', function(){
    console.log('Connected to clinic handler')
    mqttClient.subscribe('fikahandler/#',{qos: 1}, function(err){
        if (!err){
            console.log('Subbed to fikahandler')
        }
    /*     
        mqttClient.publish('fikahandler/fikabreak', JSON.stringify({ "date": {"year": "2021", "month": "12", "day": "25"},"time": "14:30 - 15:00","dentist": "Mrs",  "type":"Fika"})
        )
    */  
    })
})
mqttClient.on('message', function(topic, payload){
    var messageInformation = payload.toString(); 
    if (topic == 'fikahandler/lunchbreak'){
        const breaker = new CircuitBreaker(lunchBreakContoller.bookingOfLunch(mqttClient, messageInformation), breakerOptions); //We wrap all our functions in circuit breakers.
        breaker.fire().then(console.log).catch(console.error); //To execute the function we call this method. Now the breaker can keep track of successes and failures, determined by the timeout and the Promise returned from the function.
        breaker.fallback(() => mqttClient.publish('frontend/bookingapproval', 'Over capacity, please try again later')); //When the circuit is open we fallback to sending this message to the frontend.
    } else if (topic == 'fikahandler/fikabreak'){
        const breaker = new CircuitBreaker(fikaBreakController.bookingOfFika(mqttClient, messageInformation), breakerOptions);
        breaker.fire().then(console.log).catch(console.error);
        breaker.fallback(() => mqttClient.publish('frontend/bookingapproval', 'Over capacity, please try again later'));
    } else if (topic == 'fikahandler/approval'){
        console.log(payload.toString())
    } else if (topic == 'fikahandler/error'){
        console.log(payload)
    }
})

// Variables
var mongoURI = process.env.MONGODB_URI || 'mongodb+srv://dbcomp:VZG0Qruv6jCQFrqw@cluster0.whbcc.mongodb.net/cluster0?retryWrites=true&w=majority';
var port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, function(err) {
    if (err) {
        console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`);
        console.error(err.stack);
        process.exit(1);
    }
    console.log(`Connected to MongoDB with URI: ${mongoURI}`);
});

