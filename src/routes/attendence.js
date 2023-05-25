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
    const employee_ID = req.params.employee_ID;
    var today = new Date();
  
  
    db.query(`SELECT * FROM attendance WHERE employee_ID = '${employee_ID}' AND DATE(CONVERT_TZ(CURDATE(), '+00:00', '+05:30')) = date`, (err, rows) => {
      if (err) {
        console.log('Error fetching data: ' + err);
        return res.sendStatus(500);
      }
  
      const isAttendanceMarked = rows.length > 0;
  
      if(isAttendanceMarked){
        if(rows[0].out_time !== null){
         return res.json({...rows[0] ,isattendencemarked: "Marked" });

        }else{
         return res.json({...rows[0] ,isattendencemarked: isAttendanceMarked });

        }
      }

      return res.json({ isattendencemarked: isAttendanceMarked });
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


      const employee_ID = req.body.employee_ID;
      var today = new Date();
    
    console.log(employee_ID)
      db.query(`SELECT * FROM attendance WHERE employee_ID = '${employee_ID}' AND DATE(CONVERT_TZ(CURDATE(), '+00:00', '+05:30')) = date`,async (err, rows) => {
        if (err) {
          console.log('Error fetching data: ' + err);
          return res.sendStatus(500);
        }
    
        const isAttendanceMarked = rows.length > 0;
        



console.log("isAttendanceMarked")
console.log(isAttendanceMarked)



        const { employee_ID, date, location_Coordinates, photo, time } = req.body;

        if (isAttendanceMarked) {
          // If attendance is already marked, update the 'out_time' for the given employee_ID and date
          await promiseDb.query(`UPDATE attendance SET out_time = '${time}' WHERE employee_ID = '${employee_ID}' AND date = '${date}'`);
        } else {
          // If attendance is not marked, insert a new row with the provided values
          await promiseDb.query(`INSERT INTO attendance (employee_ID, date, in_time, location_Coordinates, photo) VALUES ('${employee_ID}', '${date}', '${time}', '${location_Coordinates}', '${photo}')`);
        }
    
      return res.json('added');
      })
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });










  
  module.exports=router