var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dentistClinicSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    owner: { type: String, required: true },
    dentists: { type: Number, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    coordinate: {
        longitude: { type: String, required: true },
        latitude: { type: String, required: true }
    },
    openinghours: {
        monday: {
            open: { type: String, required: true },
            close: { type: String, required: true }
        },
        tuesday: {
            open: { type: String, required: true },
            close: { type: String, required: true }
        },
        wednesday: {
            open: { type: String, required: true },
            close: { type: String, required: true }
        },
        thursday: {
            open: { type: String, required: true },
            close: { type: String, required: true }
        },
        friday: {
            open: { type: String, required: true },
            close: { type: String, required: true }
        }
    }
})

module.exports = mongoose.model('dentistClinic', dentistClinicSchema);
