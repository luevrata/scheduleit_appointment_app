const express = require('express');
const availabilityService = require('./availabilityService');
const cors = require('cors');
const TimeslotManager = require("./controller/TimeslotManager.js");
const userService = require("./userService");

const router = express.Router();
router.use(cors());

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await availabilityService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

router.get('/get-timeslots/:businessID/:branchID/:specialistID', async (req, res) => {
    const businessId = req.params["businessID"];
    const branchId = req.params["branchID"];
    const specialistId = req.params["specialistID"];
    const tableContent = await availabilityService.getAvailabilities(businessId, branchId, specialistId);
    const transformedData = tableContent.map(avail=> {
        return {
            startDate: avail[0],
            endDate: avail[1],
            specialistID:avail[2],
            businessID: avail[3],
            branchID: avail[4],
        };
    });

    const tm= new TimeslotManager();
    //todo make duration flexible
    const timeslots = await tm.getTimeslots(60, transformedData);
    res.json({ data: timeslots});
});

router.post('/update-availability', async (req, res) => {
    const {startDate, endDate, specialistID, businessID, branchID} = req.body;
    const tableContent = await availabilityService.updateAvailability(startDate, endDate, specialistID, businessID, branchID);

    const availraw = await availabilityService.getAvailabilities(businessID, branchID, specialistID);
    //todo create appointment


    res.json({ data: availraw});
});

module.exports = router;