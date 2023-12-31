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
        const user = await connection.execute(
            'SELECT * FROM customer WHERE userID = :userID',
            [userID]
        );
        const theUser = user.rows[0];
        return {
            userID: theUser[0],
            customerName: theUser[1],
            phoneNo: theUser[2],
            email: theUser[3],
        };
    }).catch((e) => {
        return (e);
    });
}

//TODO REMOVE
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

 async function authenticateUser(email, password) {
     return await withOracleDB(async (connection) => {
         const user = await connection.execute(
             'SELECT * FROM customer WHERE email = :email AND userPassword=:password',
             [email, password]
         );
         if (user.rows.length===1) {
             const theUser = user.rows[0];
             return {
                 userID: theUser[0],
                 customerName: theUser[1],
                 phoneNo: theUser[2],
                 email: theUser[3],
             };
         } else if (user.rows.length < 1) {
             return new Error('received no users to authenticate');
         } else {
             return new Error('received > 1 user, should not be possible');
         }
     }).catch((e) => {
         return e;
     });
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
    }).catch((e) => {
        return (e);
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