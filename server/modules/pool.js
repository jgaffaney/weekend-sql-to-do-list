const pg = require('pg');

const pool = new pg.Pool({
    database: 'weekend-to-do-app',
    host: 'localhost',
    port: 5432,
    max: 10,
    idleTimeoutMillis: 3000
})

pool.on("connect", () => {
    console.log('connected to postgres');
});

pool.on("error", (error) => {
    console.log('error connecting to postgres', error);
});

module.exports = pool;