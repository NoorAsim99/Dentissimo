var Timeslot = require ("../models/timeslot")

const bookingOfFika = function(mqttClient, messageInformation){
    var messageToJson = JSON.parse(messageInformation)
    console.log(messageToJson)
    return new Promise((resolve, reject) =>{
    var myFilter = {
        "date": messageToJson.date,
        "dentist": messageToJson.dentist
    }

/* Checks the database for timeslot documents for that day to see if the slot time is already booked or free so that a break can be scheduled. 
*/
Timeslot.find(myFilter, function(err, timeSlotDocument){
        console.log(timeSlotDocument.length)
        console.log(timeSlotDocument)
        if (err){ 
            mqttClient.publish('fikahandler/error', 'Error with Lunch break')
            reject(messageInformation);
        }
/*
If it found one booked timeslot in the day in the database that was requested from the frontend it will check the type of booking
*/
        else if(timeSlotDocument.length > 0){
        console.log(timeSlotDocument.length)
            Timeslot.exists({
            type: "Fika" ,
            date: messageToJson.date,
            dentist: messageToJson.dentist}, function(err, timeSlotDocumentFika){
                if(timeSlotDocumentFika == true){
                    mqttClient.publish('fikahandler/approval', 'DENIED \n You have already had booked your fika today')
                } else {
                    Timeslot.exists({
                        type: "Lunch",
                        date: messageToJson.date,
                        dentist: messageToJson.dentist,
                        time: messageToJson.time}, function(err, timeSlotDocumentLunch){
                            if(timeSlotDocumentLunch == true){
                                mqttClient.publish('fikahandler/approval', 'DENIED \n You have a lunch break already booked at this time')        
                            } else {
                                Timeslot.exists({
                                    type: "booking",
                                    date: messageToJson.date,
                                    dentist: messageToJson.dentist,
                                    time: messageToJson.time}, function(err, timeSlotDocumentBooking){
                                        if(timeSlotDocumentBooking == true){
                                            mqttClient.publish('fikahandler/approval', 'DENIED \n You have a patient booking at this time') 
                                        } else {
                                            bookFika(messageToJson, mqttClient)
                                        }
                                })    
                            }
                        })
                        }}
                        )
                        resolve(messageInformation);
                    } else {
            bookFika(messageToJson, mqttClient)
            resolve(messageInformation);
        }
    })
})
}


/*
The function for creating a fika break in our database
If all previous cross-checks were passed it will save it to the database
*/

function bookFika( messageToJson, mqttClient){
    console.log('BOOKING FIKA')
    var newTimeslot = new Timeslot({
        date: messageToJson.date,
        time: messageToJson.time,
        dentist: messageToJson.dentist,
        type: 'Fika'
        })
        
        newTimeslot.save();
        mqttClient.publish('fikahandler/approval', 'APPROVED \n Fika Booked')
    }    

module.exports = {
    bookingOfFika
}