var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true }
    },
    password: { type: String, required: true },
    email: { type: String, required: true },
    SSN: { type: Number, required: true },
    isDentist: { type: Boolean, required: true }
});

module.exports = mongoose.model('users', userSchema);