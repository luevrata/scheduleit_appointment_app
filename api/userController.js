const express = require('express');
const userService = require('./userService');
const cors = require('cors');
const session =require('express-session');
const cookieParser = require('cookie-parser')

const router = express.Router();
router.use(cors({
    origin: 'http://localhost:3000',
    methods: ['POST', 'GET'],
    credentials: true,
}))
router.use(cookieParser())
router.use(session({
    secret:'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 1000*60*60*24
    }
}))

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.

// ***** CUSTOMER USER *****
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await userService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

// router.get('/customer/email/:email', async (req, res) => {
//     const tableContent = await userService.getCustomerByEmail(req.params["email"]);
//     res.json({data: tableContent});
// });
//
// router.get('/customer/id/:customerID', async (req, res) => {
//
//     const tableContent = await userService.getCustomerById(parseInt(req.params["customerID"]));
//     res.json({data: tableContent});
// });

router.get('/customer/appointments/:customerID', async (req, res) => {
    const tableContent = await userService.getAllAppointmentsForCustomer(parseInt(req.params["customerID"]));
    res.json({data: tableContent});
});

router.post("/customer/auth", async (req, res) => {
    const {email, password } = req.body;
    const authUser = await userService.authenticateUser(email, password);
    if (!(authUser instanceof Error)) {
        req.session.username = authUser.userID;
        req.session.save();
        console.log("Session after authentication:", req.session.username);
        res.json({ success: true});
    } else {
        res.status(500).json({ success: false });
    }
});

router.get("/customer/info", async (req, res)=> {
    console.log("Session before info:", req.session.username);
    if(req.session.username) {
        const customerInfo = await userService.getCustomerById(req.session.username);
        return res.json({valid: true, customer: customerInfo})
    } else {
        return res.json({valid: false})
    }
})

// thinking about adding a feature where IDs for customer, business, specialist, and service are auto generated
// If we do this then don't need customerID in here
router.post("/customer/add", async (req, res) => {
    const {name, phone, email, pass} = req.body;
    const id = Date.now();
    const addCustomer = await userService.addNewCustomer(id, name, phone, email, pass);
    if (addCustomer) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});


// ***** ADMIN USER *****

router.get('/admin/email/:email', async (req, res) => {
    const tableContent = await userService.getAdminByEmail(req.params["email"]);
    res.json({data: tableContent});
});

router.get('/admin/id/:adminID', async (req, res) => {
    const tableContent = await userService.getAdminById(req.params["adminID"]);
    res.json({data: tableContent});
});



router.get("/admin/auth/:email/:password/:adminID", async (req, res) => {
    const tableContent = await userService.getAdminEmailAndPass(parseInt(req.params["adminID"]));
    const authUser = userService.authenticateUser(req.params["email"], req.params["password"], tableContent);
    if (authUser) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

// same comment as before for customer.
// should add an endpoint to get branch and business IDs too so that we don't need to keep track of them manually
router.post("/admin/add", async (req, res) => {
    const {id, name, phone, email, branchID, businessID, pass} = req.body;
    const addCustomer = await userService.addNewAdmin(id, name, phone, email, branchID, businessID, pass);
    if (addCustomer) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});


module.exports = router;