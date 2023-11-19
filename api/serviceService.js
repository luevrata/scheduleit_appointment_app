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

async function getServices() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM SERVICE');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function getServicesBySid(specialistID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT p.SPECIALISTID, s.SERVICENAME, s.PRICE, s.DURATION  FROM PROVIDES p, SERVICE s WHERE p.SERVICENAME = s.SERVICENAME AND p.SPECIALISTID = :speaclistID', [specialistID]);
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function getDuration(serviceName) {
    return await withOracleDB(async (connection) => {
        const service = serviceName.toLowerCase();
        const result = await connection.execute('SELECT DURATION FROM SERVICE WHERE LOWER(SERVICENAME) = :serviceName', [service]);

        if (result.rows.length > 0 ) {
            return result.rows[0][0];
        } else {
            return 0;
        }
    }).catch((e) => {
        throw e;
    });
}


module.exports = {
    testOracleConnection,
    getServices,
    getServicesBySid,
    getDuration
};