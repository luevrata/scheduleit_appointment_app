const express = require('express');
const appService = require('./userService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.

// ***** CUSTOMER USER *****
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

router.get('/customer/email/:email', async (req, res) => {
    const tableContent = await appService.getCustomerByEmail(req.params["email"]);
    res.json({data: tableContent});
});

router.get('/customer/id/:customerID', async (req, res) => {

    const tableContent = await appService.getCustomerById(parseInt(req.params["customerID"]));
    res.json({data: tableContent});
});

router.get('/customer/appointments/:customerID', async (req, res) => {
    const tableContent = await appService.getAllAppointmentsForCustomer(parseInt(req.params["customerID"]));
    res.json({data: tableContent});
});

router.get("/customer/auth/:email/:password/:customerID", async (req, res) => {
    const tableContent = await appService.getCustomerEmailAndPass(parseInt(req.params["customerID"]));
    const authUser = authenticateUser(req.params.email, req.params.password, tableContent)
    if (authUser) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

// thinking about adding a feature where IDs for customer, business, specialist, and service are auto generated
// If we do this then don't need customerID in here
router.post("/customer/add/:customerID/:customerName/:phoneNo/:email/:userPassword ", async (req, res) => {
    const addCustomer = await appService.addNewCustomer(parseInt(req.params["customerID"]), req.params["customerName"], req.params["phoneNo"], req.params["email"], req.params["userPassword"]);
    if (addCustomer) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});


// ***** ADMIN USER *****

router.get('/admin/email/:email', async (req, res) => {
    const tableContent = await appService.getAdminByEmail(req.params["email"]);
    res.json({data: tableContent});
});

router.get('/admin/id/:adminID', async (req, res) => {
    const tableContent = await appService.getAdminById(req.params["adminID"]);
    res.json({data: tableContent});
});



router.get("/admin/auth/:email/:password/:adminID", async (req, res) => {
    const tableContent = await appService.getAdminEmailAndPass(parseInt(req.params["adminID"]));
    const authUser = authenticateUser(req.params.email, req.params.password, tableContent)
    if (authUser) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

// same comment as before for customer. 
// should add an endpoint to get branch and business IDs too so that we don't need to keep track of them manually
router.post("/admin/add/:adminID/:adminName/:phoneNo/:email/:branchID/:businessID/:adminPassword", async (req, res) => {
    const addCustomer = await appService.addNewCustomer(parseInt(req.params["adminID"]), req.params["adminName"], req.params["phoneNo"], req.params["email"], req.params["branchID"], req.params["businessID"], req.params["adminPassword"]);
    if (addCustomer) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});


module.exports = router;