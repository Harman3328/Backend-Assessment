/**
 * The above code exports a function named `queryDatabase` that connects to a PostgreSQL database using
 * the `pg` library and executes a query, returning the result.
 * @param query - The `query` parameter is a string that represents the SQL query you want to execute
 * on the database. It can be any valid SQL statement, such as SELECT, INSERT, UPDATE, DELETE, etc.
 * @param values - The `values` parameter is an optional array that contains the values to be
 * substituted into the query string. It is used to prevent SQL injection attacks and allows you to
 * dynamically pass values to your queries.
 * @returns The `queryDatabase` function returns the rows returned by the executed query.
 */
const { Pool, Client } = require('pg')
require("dotenv").config();

const pool = new Pool({
  user: process.env.USERNAME,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: 5432, // Default PostgreSQL port is 5432
});

/**
 * The function `queryDatabase` executes a database query using the provided query string and values,
 * and returns the result rows.
 * @param query - The query parameter is a string that represents the SQL query you want to execute on
 * the database. It can include placeholders for values that will be replaced by the values parameter.
 * @param values - The `values` parameter is an array that contains the values to be used in the query.
 * These values are used as placeholders in the query string to prevent SQL injection attacks. The
 * values are passed as an array in the same order as the placeholders appear in the query string.
 * @returns the rows returned by the database query.
 */
async function queryDatabase(query, values) {
  try {
    const result = await pool.query(query, values);
    console.log('Query result:', result.rows);
    return result.rows;
  } catch (err) {
    console.error('Error executing query:', err);
    throw err;
  }
}


module.exports = { queryDatabase }