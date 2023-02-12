const express = require('express');
const bodyParser = require('body-parser');
// const promiseDb = require('../utils/db');
const {promiseDb} = require('../utils/db');
const {db} = require('../utils/db');
const checkAuth = require('./middlewares/checkAuth');
const app=express()
const router = express.Router();

app.use(bodyParser.json());


router.use(checkAuth)

router.get('/', (req, res) => {
  db.query('SELECT * FROM Attendance', (err, rows) => {
      if (err) {
        console.log('Error fetching data: ' + err);
        return res.sendStatus(500);
      }
      res.json(rows);
    });
  });
  


router.get('/getTodayDataFromID/:email', (req, res) => {

const email=req.params.email

var currentDate = new Date();
var sqlDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');


  db.query(`SELECT * FROM Attendance WHERE email = '${email}' AND date = ${sqlDate}`, (err, rows) => {
      if (err) {
        console.log('Error fetching data: ' + err);
        return res.sendStatus(500);
      }
      res.json(rows);
    });


  });
  


router.post('/getDataFromID', (req, res) => {

const email=req.body.email
const month=req.body.month


  db.query(`SELECT * FROM Attendance WHERE email = '${email}' AND  MONTH(date) = ${month}`, (err, rows) => {
      if (err) {
        console.log('Error fetching data: ' + err);
        return res.sendStatus(500);
      }
      res.json(rows);
    });


  });
  


  router.post('/add', async (req, res) => {
    try {
      // Get data from request body


      const { id,email,date,time,location_Coordinates,photoUrl } = req.body;
  

      // Check if user already exists
      const [rows]  = await promiseDb.query(`SELECT * FROM Attendance WHERE id = '${id}'`);
 
      if (rows.length != 0) {
        return res.status(409).json({ error: 'Attendance exists' });
      }
  
      // Hash the password

  
      // Insert the new user into the database
      await promiseDb.query(`INSERT INTO Attendance (id,email,date,time,location_Coordinates,photoUrl) VALUES ('${id}', '${email}', '${date}', '${time}', '${location_Coordinates}', '${photoUrl}')`);
  
    //   // Create and return a JWT
      return res.json('added');
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });










  
  module.exports=router