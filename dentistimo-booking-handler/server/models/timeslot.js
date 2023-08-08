var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var timeslotSchema = new Schema({
    date: {
        year: { type: String }, //YYYY
        month: { type: String }, //Month
        day: { type: String } //DD
    },
    time: { type: String },   //TT:TT
    patient: { type: String }, //ID
    dentist: { type: String }, //ID
    clinic: { type: String }, //ID
    note: { type: String },
    type: { type: String } // 'booking' || 'lunch' || 'fika'
})


module.exports = mongoose.model('timeslot', timeslotSchema)

