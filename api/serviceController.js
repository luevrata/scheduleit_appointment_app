const express = require('express');
const serviceService = require('./serviceService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

router.get('/get-services', async (req, res) => {
    const tableContent = await serviceService.getServices();
    res.json({data: tableContent});
});

router.get('/get-services/sid/:specialistId', async (req, res) => {
    const tableContent = await serviceService.getServicesBySid(req.params["specialistId"]);
    res.json({data: tableContent});
});

router.get('/get-duration/:serviceName', async (req, res) => {
    const duration = await serviceService.getDuration(req.params["serviceName"]);
    res.json({data: duration});
});


module.exports = router;