// db.js
const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  user: 'postgres', 
  password: 'admin', 
  database: 'tailorg',  
  port: 5432,
});

client.connect()
  .then(() => console.log('Database connected successfully.'))
  .catch(err => console.error('Database connection error:', err.stack));

module.exports = client;
