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

async function getBusinesses() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM BUSINESS');
        return result.rows;
    }).catch((e) => {
        return (e);
    });
}

async function getBusinessByID(id) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM BUSINESS WHERE businessID=:id',
            [id],
            { autoCommit: true });
        return result.rows;
    }).catch((e) => {
        return(e);
    });
}


module.exports = {
    testOracleConnection,
    getBusinesses,
    getBusinessByID,
};