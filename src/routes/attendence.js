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
  db.query('SELECT * FROM attendance', (err, rows) => {
      if (err) {
        console.log('Error fetching data: ' + err);
        return res.sendStatus(500);
      }
      res.json(rows);
    });
  });
  


router.get('/getTodayDataFromID/:employee_ID', (req, res) => {

const employee_ID=req.params.employee_ID
var today = new Date();
var sqlDate = today.getFullYear()+'-'+(today.getMonth()+1).toString().padStart(2, '0')+'-'+today.getDate();



  db.query(`SELECT * FROM attendance WHERE employee_ID = '${employee_ID}' AND DATE(CONVERT_TZ(date, '+05:30', '+00:00')) = CURDATE();

  
  `, (err, rows) => {
      if (err) {
        console.log('Error fetching data: ' + err);
        return res.sendStatus(500);
      }
      res.json(rows);
    });


  });
  


router.post('/getDataFromID', (req, res) => {

const employee_ID=req.body.employee_ID
const month=req.body.month

console.log(month)
console.log(employee_ID)

  db.query(`SELECT * FROM attendance WHERE employee_ID = '${employee_ID}' AND  MONTH(CONVERT_TZ(date, '+05:30', '+00:00')) = ${month}`, (err, rows) => {
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


      const { employee_ID, date, in_time, location_Coordinates, photo, out_time } = req.body;
  

      
  
      // Insert the new user into the database
      await promiseDb.query(`INSERT INTO attendance ( employee_ID, date, in_time, location_Coordinates, photo, out_time) VALUES ( '${employee_ID}', '${date}', '${in_time}', '${location_Coordinates}', '${photo}', '${out_time}')`);
  
    //   // Create and return a JWT
      return res.json('added');
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });










  
  module.exports=router