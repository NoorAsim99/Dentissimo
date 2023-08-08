const express = require("express");
var router = express.Router();
var User = require('../models/User');

// log the user in
router.get('/api/users/:email/:password', function (req, res, next) {
  User.findOne({"email": req.params.email}, function (err, user) {
    if (err) {
      return next(err);
    }

    if (user == null) {
      return res.status(404).json({ message: "User Not Found" });
    }
    
    if (user) {
        if ( req.params.password === user.password)
        return res.status(200).json(user);
        else res.status(401).json({"message": "Incorrect password" })
    }

  });
})

// Create a new user
router.post('/api/users', function (req, res, next) {
  console.log(req.body);
  var user = new User(req.body);
  user.save(function (err, user) {
      if (err) {
          if (err.code == 11000) { // Means an user with that username already exists
              return res.status(400).json({ "message": "Username taken" });
          }
          else {
              console.log(err);
              return next(err);
          }
      }
      res.status(201).json(user);
  })
});

/*
var express = require('express');
var router = express.Router();
var Patient = require('../models/User');

// Placeholder Post to test if cookies are being sent with the header
router.post('/api/patients', function (req, res, next) {
    var patient = new Patient(req.body);
    patient.save(function (err, patient) {
        if (err) {
                return res.status(400).json;
            }
            else{
                res.status(201).json(patient);
            }
    })
});

//router.get/'/patients/:password', function(req,res,next) {
//var password = req.params.password;
//Patient.find({ "password": password}, function (err, patient) {
//  if (err) { return next(err) }
//  if (patient == null || patient.length === 0) {
//    res.status(404).json;
//  } else {
//    const sessionPatient = { id: req.body.id, email: req.body.email, password: req.body.password};
//    req.session.user = sessionPatient;
//    res.status(200).json(patient);
//
//  }
//})
//}
//
//GET all patients
const getAllPatients = function (req, res, next) {
  Patient.find(function (err, patients) {
    if (err) {
      return next(err);
    }
    res.status(200).json(patients);
  });
};

//Register patients
const createPatient = function (req, res, next) {
  let patient = new Patient(req.body);

  patient.save(function (err, patient) {
    if (err) {
      return next(err);
    }
    res.status(201).json(patient);
  });
};

//GET patient BY ID
const getPatient = function (req, res, next) {
  Patient.findById(req.params.id, function (err, patient) {
    if (err) {
      return next(err);
    }

    if (patient == null) {
      return res.status(404).json({ message: "Patient Not Found" });
    }

    res.status(200).json(patient);
  });
};

//PUT patient ID
// Too risky!: to discuss
//const putPatient = function (req, res) {
//  let id = req.params.id;
//
//  Patient.findById(id, function (err, patient) {
//    if (err) {
//      return next(err);
//    }
//
//    if (patient == null) {
//      return res.status(404).json({ message: "Patient Not Found" });
//    }
//   
//    patient.name = req.body.name;
//    patient.password = req.body.password;
//    patient.email= req.body.email;
//    patient.SSN= req.body.SSN;
//    patient.bookings= req.body.bookings;
//    patient.save();
//
//    res.status(201).json(patient);
//  });
//};

//PATCH patient ID
const patchPatient = function (req, res) {
  let id = req.params.id;

  Patient.findById(id, function (err, patient) {
    if (err) {
      return next(err);
    }

    if (patient == null) {
      return res.status(404).json({ message: "Patient Not Found" });
    }

    patient.name = req.body.name || patient.name;
    patient.password = req.body.password || patient.password;
    patient.email= req.body.email || patient.email;
    patient.SSN= req.body.SSN || patient.SSN;
    // Not needed?
    //patient.bookings= req.body.bookings || patient.bookings;
 
    patient.save();

    res.status(201).json(patient);
  });
};

//DELETE patient BY ID
const deletePatient = function (req, res) {
  let id = req.params.id;

  Patient.findOneAndDelete({ _id: id }, function (err, patient) {
    if (err) {
      return next(err);
    }

    if (patient == null) {
      return res.status(404).json({ message: "Patient Not Found" });
    }

    res.status(200).json(patient);
  });
};

//Booking
//Add Booking to Patient
const addBookingToPatient = function (req, res, next) {
  Patient.findById(req.params.id, function (err, patient) {
    if (err) {
      return next(err);
    }

    if (patient == null) {
      return res.status(404).json({ message: "Patient Not Found" });
    }

    let booking = new Booking(req.body);

    booking.save(function (err, meal) {
      if (err) {
        return next(err);
      }
    });

    patient.bookings.push(booking);
    patient.save();
    res.status(201).json(patient);
  });
};

//Get Booking by Patient id
const getAllPatientBookings = function (req, res, next) {
  Patient.findById(req.params.id)
    .populate("bookings")
    .exec(function (err, patient) {
      if (err) {
        return next(err);
      }
      res.status(200).json(patient.bookings);
    });
};

// Get Booking by Patient id
const getPatientBookingById = function (req, res, next) {
  Patient.findById(req.params.id)
    .populate("bookings")
    .exec(function (err, patient) {
      if (err) {
        return next(err);
      }

      res
        .status(200)
        .json(patient.bookings.find((item) => item._id == req.params.bookingid));
    });
};

//Delete bookings by id for patient
const deleteBookingById = function (req, res, next) {
  Patient.findById(req.params.id, function (err, patient) {
    if (err) {
      return next(err);
    }

    if (patient == null) {
      return res.status(404).json({ message: "Patient Not Found" });
    }

    patient.bookings = patient.bookings.filter((item) => item._id == req.params.bookingid);
    patient.save();
    res.status(200).json(patient.bookings);
  });
};

//Put booking
const putPatientBooking = function (req, res, next) {
  Patient.findById(req.params.id)
    .populate("bookings")
    .exec(function (err, patient) {
      if (err) {
        return next(err);
      }

      let booking = patient.bookings.find((item) => item._id == req.params.bookingid);

      booking.available = req.body.available;
      booking.date = req.body.date;
      booking.time = req.body.time;
      booking.clinic = req.body.clinic;
      booking.patient = req.body.patient;

      booking.save();

      res.status(201).json(patient.bookings);
    });
};

//Patch booking for patient
const patchPatientBooking = function (req, res, next) {
  Patient.findById(req.params.id)
    .populate("bookings")
    .exec(function (err, patient) {
      if (err) {
        return next(err);
      }

      let booking = patient.bookings.find((item) => item._id == req.params.bookingid);
 
      booking.available = req.body.available || booking.available;
      booking.date = req.body.date || booking.date;
      booking.time = req.body.time || booking.time;
      booking.clinic = req.body.clinic || booking.clinic;
      booking.patient = req.body.patient || booking.patient;

      booking.save();

      res.status(201).json(patient.bookings);
    });
};

module.exports = {
  getAllPatients,
  createPatient,
  getPatient,
  patchPatient,
  deletePatient,
  putPatientBooking,
  addBookingToPatient,
  getAllPatientBookings,
  getPatientBookingById,
  deleteBookingById,
  patchPatientBooking,
};*/


module.exports = router;
