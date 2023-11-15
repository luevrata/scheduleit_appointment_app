const express = require('express');
const businessService = require('./businessService');
const cors = require('cors');

const router = express.Router();
router.use(cors());

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await businessService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

router.get('/get-businesses', async (req, res) => {
    try {
        const tableContent = await businessService.getBusinesses();
        let transformedData = [];
        transformedData = tableContent.map(business => {
            return {
                id: business[0],
                name: business[1],
                // Add more fields as needed
            };
        });
        res.json({data: transformedData});
    } catch (e) {
        res.status(500).json({error: e, displayMessage:'Internal Server Error'})
    }
});

router.get('/get-business/:bid', async (req, res) => {
    const businessId = req.params["bid"];
    const tableContent = await businessService.getBusinessByID(businessId) ;
    res.json({data: tableContent});
});

module.exports = router;