const {Pool} = require('pg');

exports.pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: process.env.SQL_DATABSE,
    password: process.env.SQL_PASSWORD,
    port: process.env.SQL_PORT
});
