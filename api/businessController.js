const express = require('express');
const businessService = require('./businessService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/business/check-db-connection', async (req, res) => {
    const isConnect = await businessService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

router.get('/business/get-businesses', async (req, res) => {
    const tableContent = await businessService.getBusinesses();
    res.json({data: tableContent});
});

router.get('/business/get-business-byId/:bid', async (req, res) => {
    const businessId = Number(req.params["bid"]);
    const tableContent = await businessService.getBusinessByID(businessId) ;
    res.json({data: tableContent});
});


module.exports = router;