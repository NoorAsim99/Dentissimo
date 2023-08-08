var express = require('express');
var mongoose = require('mongoose');
var morgan = require('morgan');
var path = require('path');
var cors = require('cors');
var history = require('connect-history-api-fallback');

//controller
const clinicController = require ('./controllers/clinics')

const mqtt = require('mqtt');
let Clinic = require("./models/clinics");
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
    mqttClient.subscribe('clinichandler/#',{qos: 1}, function(err){
        if (!err){
            console.log('Subbed to Clinic Handler')
        }
        //Sending topic to itself for testing, will remove later.
        mqttClient.publish('clinichandler/oneClinicsData',JSON.stringify({"name":"Your Dentist"}
    ))
    })
})

mqttClient.on('message', function(topic, payload){
    console.log(topic + " " + payload + "\n")
    var clinicRequest = payload.toString()
    if (topic == 'clinichandler/allClinicsData'){
        console.log('RETRIEVING ALL CLINICs')
        clinicController.getAllClinics(mqttClient)//get all clinics data from DB

    }else if(topic == 'clinichandler/oneClinicsData'){
        console.log('RETRIEVING ONE CLINIC')
        clinicController.getOneClinic(mqttClient, clinicRequest)

    }else if(topic == 'clinichandler/clinicData'){
        console.log('COOL IM RECEIVING A TOPIC')
        console.log(JSON.parse(clinicRequest));

    }else if (topic == 'clinichandler/error'){
        console.log(topic + " " + payload)
    } 
})

// Variables
var mongoURI = process.env.MONGODB_URI || 'mongodb+srv://dbcomp:VZG0Qruv6jCQFrqw@cluster0.whbcc.mongodb.net/cluster0?retryWrites=true&w=majority';
var port = process.env.PORT ||45000;

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, function(err) {
    if (err) {
        console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`);
        console.error(err.stack);
        process.exit(1);
    }
    console.log(`Connected to MongoDB with URI: ${mongoURI}`);
});
