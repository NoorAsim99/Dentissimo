var Timeslot = require ("../models/timeslot")

const bookingOfLunch = function(mqttClient, messageInformation){
    var messageToJson = JSON.parse(messageInformation)
    console.log(messageToJson)
    return new Promise((resolve, reject) =>{
    var lunchBookingSecondSlotTime = createSecondSlotTime(messageToJson.time, mqttClient)
    var myFilter = {
        "date": messageToJson.date,
        "dentist": messageToJson.dentist
    }

    /* Checks the database for timeslot documents for that day to see if the slot time is already booked or free so that a break can be scheduled. If there are no found documents based on MyFilter we can immediately create a booking otherwise we need to do some cross-checking of conditions based on time and availability and if they are passed we can create a booking
    */

   Timeslot.find(myFilter, function(err, timeSlotDocument){
    console.log(timeSlotDocument.length)
    console.log(timeSlotDocument)
    if (err){ 
        mqttClient.publish('fikahandler/error', 'Error with Lunch break')
        reject(messageInformation); 
    }
    else if(timeSlotDocument.length > 0){
        Timeslot.exists({
        type: "Lunch",
        date: messageToJson.date,
        dentist: messageToJson.dentist}, function(err, timeSlotDocumentLunch){
            if(timeSlotDocumentLunch == true){
                mqttClient.publish('fikahandler/approval', 'DENIED \n You have already eaten today')
            }else{
                Timeslot.exists({
                    type: "Fika",
                    date: messageToJson.date,
                    dentist: messageToJson.dentist,
                    time: {$in: [messageToJson.dentist, lunchBookingSecondSlotTime]}
                    }, function(err, timeSlotDocumentFika){
                        if(timeSlotDocumentFika == true){
                            mqttClient.publish('fikahandler/approval', 'DENIED \n You have a fika break already booked within the selected time interval.')        
                        }else{ 
                        Timeslot.exists({
                            type: "booking",
                            date: messageToJson.date,
                            dentist: messageToJson.dentist,
                            time: {$in: [messageToJson.dentist, lunchBookingSecondSlotTime]}}, function(err, timeSlotDocumentBooking){
                                if (timeSlotDocumentBooking == true){
                                    mqttClient.publish('fikahandler/approval', 'DENIED \n You have a patient booking at this time')
                                }else{
                                    createALunch(messageToJson, lunchBookingSecondSlotTime, mqttClient)
                                }
                            })    
                        }
                    })
                }
        })
        resolve(messageInformation);
    } else {
    createALunch(messageToJson, lunchBookingSecondSlotTime, mqttClient)
    resolve(messageInformation);
    }
})
})
}

/*creates two booked slot times for lunch in the database if all cross-checks are passed*/

function createALunch( messageToJson, secondTimeSlot, mqttClient){
    console.log('BOOKING LUNCH')
    var newTimeslot = new Timeslot({
        date: messageToJson.date,
        time: messageToJson.time,
        dentist: messageToJson.dentist,
        type: 'Lunch'
    })
    var newSecondTimeslot = new Timeslot({
        date: messageToJson.date,
        time: secondTimeSlot,
        dentist: messageToJson.dentist,
        type: 'Lunch'
    })
    newTimeslot.save();
    newSecondTimeslot.save(); 
    mqttClient.publish('fikahandler/approval', 'APPROVED \nLunch Booked')
}

/*
We are storing the database bookings as 30min slottimes in the database. Since the lunch break is one hour we need to book two slot times when making a lunch break booking and this fucntion creates the second slottime based on the time sent from the frontend
*/
function createSecondSlotTime(timeStart, mqttClient){
    var zeroOrThirty = timeStart.substring(3,5)
    console.log(zeroOrThirty)
    var firstSlotTime = timeStart
    console.log(firstSlotTime)
    if (zeroOrThirty === '00'){
        var endOfLunch = parseInt(firstSlotTime.substring(1,2)) + 1
        var endOfLunchtoString = endOfLunch.toString() 
        console.log(endOfLunchtoString)
        var secondSlotTime = firstSlotTime.substring(8) + ' - ' + firstSlotTime.substring(0,1) + endOfLunchtoString + ':00'
        console.log(secondSlotTime)
        return secondSlotTime
    }else if(zeroOrThirty === '30'){
        var endOfLunchToInt = parseInt(firstSlotTime.substring(1,2)) + 1
        var endOfLunch =  firstSlotTime.substring(0,1) + endOfLunchToInt.toString() + firstSlotTime.substring(2,5)
        var secondSlotTime = firstSlotTime.substring(8) + ' - ' + endOfLunch 
        console.log(secondSlotTime)
        return secondSlotTime
    }else{
        mqttClient.publish('fikahandler/error', 'time structure does not follow clinic appointment structure')
    }
}

module.exports = {
    bookingOfLunch
}