const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`
};


// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}


// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

// ***** CUSTOMER USER *****

async function getCustomerByEmail(email) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'SELECT * FROM customer WHERE email = :email',
            [email]
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function getCustomerById(userID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'SELECT * FROM customer WHERE userID = :userID',
            [userID]
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function getCustomerEmailAndPass(userID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'SELECT email, userPassword FROM customer WHERE userID = :userID',
            [userID]
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

 function authenticateUser(email, password, user) {
    if (user.length == 1) {

        if (user[0][0] == email && user[0][1] == password) {
            return true
        } 
        return false
    } else if (len(user) < 1) {
        throw new Error('received no users to authenticate')
    } else {
        throw new Error('received > 1 user, should not be possible')
    }
    
}

// gets all appointments related to a customer using userID
// TODO: !!!!!TEST THIS!!!!!
async function getAllAppointmentsForCustomer(userID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'SELECT c.customername, a.serviceName, sp.specialistname, a.startDate, a.endDate, b.businessName, br.branchAddress\n' +
            'FROM specialist_timeslot_customer stc, specialist_timeslot_location stl, appointment a, customer c, business b, branch br, specialist sp\n' +
            'WHERE stc.specialistID = stl.specialistID AND stc.startDate = stl.startDate \n' +
            'AND stl.specialistID = a.specialistID AND stl.startDate = a.startDate\n' +
            'AND stc.userID = c.userID AND stl.businessID = br.businessID\n' +
            'AND stl.branchID = br.branchID AND br.businessID = b.businessID AND a.specialistID = sp.specialistID AND stc.userID = :userID',
            [userID]
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function addNewCustomer(userID, customerName, phoneNo, email, userPassword) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO customer (userID, customerName, phoneNo, email, userPassword) 
            VALUES (:userID, :customerName, :phoneNo, :email, :userPassword)`,
            [userID, customerName, phoneNo, email, userPassword],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

// ***** ADMIN USER *****

async function getAdminEmailAndPass(adminID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'SELECT email, adminPassword FROM administrator WHERE userID = :adminID',
            [adminID]
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function getAdminByEmail(email) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'SELECT * FROM administrator WHERE email = :email',
            [email]
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function getAdminById(adminId) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'SELECT * FROM administrator WHERE userID = :adminID',
            [adminId]
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function addNewAdmin(userID, adminName, phoneNo, email, branchID, businessID, adminPassword) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO administrator (userID, adminName, phoneNo, email, branchID, businessID, adminPassword) 
            VALUES (:userID, :adminName, :phoneNo, :email, :branchID, :businessID, :adminPassword)`,
            [userID, adminName, phoneNo, email, branchID, businessID, adminPassword],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

module.exports = {
    testOracleConnection,
    getCustomerByEmail,
    getCustomerById,
    getCustomerEmailAndPass, 
    authenticateUser,
    getAllAppointmentsForCustomer,
    addNewCustomer, 
    getAdminEmailAndPass, 
    getAdminById,
    getAdminByEmail,
    addNewAdmin
};