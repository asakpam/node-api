const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const patientSchema = new mongoose.Schema({
    patientID: { type: String, required: true, unique: true },
    surname: String,
    otherNames: String,
    gender: String,
    phoneNumber: String,
    residentialAddress: String,
    emergencyContact: {
      name: String,
      contact: String,
      relationship: String
    },
    encounters: [{
      dateAndTime: Date,
      encounterType: String,
      vitals: {
        bloodPressure: String,
        temperature: String,
        pulse: String,
        spO2: String
      }
    }]
  });ine
  
const app = express();

app.use(bodyParser.json());

const Patient = require('./models/Patient');
const Encounter = require('./models/Encounter');
const Vital = require('./models/Vital');

app.post('/patients', async (req, res) => {
    const newPatient = new Patient(req.body);

    try {
        await newPatient.save();
        res.status(201).json(newPatient);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.post('/encounters', async (req, res) => {
    const newEncounter = new Encounter(req.body);

    try {
        await newEncounter.save();
        res.status(201).json(newEncounter);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.post('/vitals', async (req, res) => {
    const newVital = new Vital(req.body);

    try {
        await newVital.save();
        res.status(201).json(newVital);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.get('/patients', async (req, res) => {
    try {
        const patients = await Patient.find();
        res.status(200).json(patients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/patients/:id', async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});