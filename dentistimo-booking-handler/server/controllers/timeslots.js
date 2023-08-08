var Timeslot = require('../models/timeslot');
const CircuitBreaker = require('opossum');

//Create a bookings
const requestBooking = function (mqttClient, bookingInfo) {
    var amountOfDentist = bookingInfo.dentists //amount of dentists at the specified clinic
    return new Promise((resolve, reject) =>{  //To work with the circuit breaker we not return a Promise from every method. If there is an error the promise is rejected, and if it succeeds we resolve the promise.
    Timeslot.find({ //filter bookings for the date and clinic
        "date.year": bookingInfo.date.year,
        "date.month": bookingInfo.date.month,
        "date.day": bookingInfo.date.day,
        "time": bookingInfo.time,
        "clinic": bookingInfo.clinic
    }, function (err, booking) {
        //if error with find
        if (err){ 
        mqttClient.publish('frontend/bookingapproval', 'Error with Booking Request')
        reject(bookingInfo);
    }
        //if there aren't any timeslot for this clinic
        //console.log(booking, booking.length, amountOfDentist)
        if (booking.length >= amountOfDentist) {
            mqttClient.publish('frontend/bookingapproval', 'No Bookings Available for this Timeslot')
            resolve(bookingInfo);
        } else if (booking.includes(bookingInfo.patient)) {
            mqttClient.publish('frontend/bookingapproval', 'You already have a booking at this timeslot.')
            resolve(bookingInfo);
        }
        else {
            //create booking out of values recieved
            var newTimeslot = new Timeslot({
                date: bookingInfo.date,
                time: bookingInfo.time,
                patient: bookingInfo.patient,
                dentist: bookingInfo.dentist,
                clinic: bookingInfo.clinic,
                note: bookingInfo.note,
                type: 'booking'
            })
            //save booking
            newTimeslot.save();
            //publish to frontend
            mqttClient.publish('frontend/bookingapproval', 'Booking Request Successful')
            resolve(bookingInfo);
        }
    })
})
}


// Get all bookings from the database
const getAllBookings = function (mqttClient, bookingInfo) {
    return new Promise((resolve, reject) =>{
    Timeslot.find({}, function (err, booking) {
        if (err) {
            mqttClient.publish('frontend/allbookings', 'Error')
            reject();
        } else if (booking == null) {
            mqttClient.publish('frontend/allbookings', null)
            resolve();
        } else {
            mqttClient.publish('frontend/allbookings', booking.toString())
            resolve();
        }
    })
    })
}

const getPatientBooking = function (mqttClient, bookingInfo) {
    var bookingArray = ''
    return new Promise((resolve, reject) =>{
    Timeslot.find({
        "patient": bookingInfo.patient
    }, function (err, booking) {
        if (err) {
            mqttClient.publish('frontend/patientbooking', 'Error')
            reject();
        } else if (booking == null) {
            mqttClient.publish('frontend/patientbooking', null)
            resolve();
        } else {
            // mqttClient.publish('frontend/patientbooking', booking.toString())
            for (let i = 0; i < booking.length; i++) {
                bookingArray = bookingArray + `{"date": {"year": "${booking[i].date.year}", "month": "${booking[i].date.month}", "day": "${booking[i].date.day}", "time": "${booking[i].date.time}"}, "_id": "${booking[i]._id}", "patient": "PAtientname", "clinic": "Lisebergs Dentists"}£`
            }
            bookingArray = bookingArray.slice(0, -1)
            mqttClient.publish('frontend/patientbooking', bookingArray)
            resolve();
        }
    })
})


}


const getDateBooking = function (mqttClient, bookingInfo) {
    return new Promise((resolve, reject) =>{
    Timeslot.find({
        date: {
            "year": bookingInfo.year,
            "month": bookingInfo.month,
            "day": bookingInfo.day
        }
    }, function (err, booking) {
        if (err) {
            mqttClient.publish('frontend/datebooking', 'Error')
            reject();
        } else if (booking == null) {
            mqttClient.publish('frontend/datebooking', null)
            resolve();
        } else {
            mqttClient.publish('frontend/datebooking', `{ "date": {"year": ${booking.date.year}, "month": ${booking.date.month}, "day": ${booking.date.day}, "time": ${booking.date.time}}, "_id": ${booking._id}, "patient": "PAtienname", "clinic": "Lisebergs Dentists"}`)
            resolve();
        }
    })
})
}

//find and delete booking by patient, date, clinic & dentist
const deleteBooking = function (mqttClient, bookingInfo) {
    return new Promise((resolve, reject) =>{
    Timeslot.findByIdAndDelete(
        bookingInfo
        ,
        function (err, booking) {
            if (err) {
                console.log(err)
                mqttClient.publish('frontend/deletebooking', 'Error')
                reject();
            }
            else if (booking == null) {
                console.log('No such booking exists')
                mqttClient.publish('frontend/deletebooking', 'No such booking exists')
                resolve();
            }
            else {
                console.log('success')
                mqttClient.publish('frontend/deletebooking', 'Success')
                resolve();
            }
        })
    })
}

module.exports = {
    requestBooking,
    getAllBookings,
    getDateBooking,
    getPatientBooking,
    deleteBooking
}