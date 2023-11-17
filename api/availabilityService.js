const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');
const TimeslotManager = require("./controller/TimeslotManager");

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

async function getAvailabilities(businessID, branchID, specialistID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'SELECT * FROM AVAILABILITY WHERE businessID=:businessID AND branchID=:branchID AND specialistID=:specialistID',
            [businessID, branchID, specialistID]
        );
        return result.rows;
    }).catch((e) => {
        return (e);
    });
}

//todo: needs check and modification
async function updateAvailability(startDate, endDate, specialistID, businessID, branchID) {
    return await withOracleDB(async (connection) => {
        const availabilitiesRaw = await getAvailabilities(businessID, branchID, specialistID);
        const availabilities = availabilitiesRaw.map(avail=> {
            return {
                startDate: avail[0],
                endDate: avail[1],
                specialistID:avail[2],
                businessID: avail[3],
                branchID: avail[4],
            };
        });
        const tm= new TimeslotManager();
        const newAvailabilities = await tm.bookTimeslot(startDate, endDate, availabilities);

        for (const newAvail of newAvailabilities) {
            for (const actualAvail of availabilities) {

                if (newAvail.startDate===actualAvail.startDate){
                    const specialistID = actualAvail.specialistID;
                    const startDate = actualAvail.startDate;
                    await connection.execute(
                        'DELETE FROM AVAILABILITY WHERE specialistID=:specialistID AND startDate=:startDate',
                        [specialistID, startDate],
                        { autoCommit: true }
                    );
                    break;
                }
            }
        }
        for (const newAvail of newAvailabilities) {
            const specialistID = newAvail.specialistID;
            const startDate = new Date(newAvail.startDate);
            const endDate= new Date(newAvail.endDate);
            const branchID = newAvail.branchID;
            const businessID = newAvail.businessID;
            if (startDate!==endDate) {
                await connection.execute(
                    'INSERT INTO AVAILABILITY (startDate, endDate, specialistID, businessID, branchID) VALUES (:startdate, :endDate, :specialistID, :businessID, :branchID)',
                    [startDate, endDate, specialistID, businessID, branchID],
                    {autoCommit: true}
                );
            }
        }

    }).catch((e) => {
        return (e);
    });
}


module.exports = {
    testOracleConnection,
    getAvailabilities,
    updateAvailability
};