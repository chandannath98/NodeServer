const mysql = require('mysql2');
require('dotenv').config();


 const db = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
  });
  
  db.connect((err) => {
    if (err) {
      console.log('Error connecting to database: ' + err.stack);
      return;
    }
    console.log('Connected to database as id ' + db.threadId);
  });
  
  const promiseDb = db.promise();

  module.exports = {promiseDb,db}