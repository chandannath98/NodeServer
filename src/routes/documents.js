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
  db.query('SELECT * FROM Documents', (err, rows) => {
      if (err) {
        console.log('Error fetching data: ' + err);
        return res.sendStatus(500);
      }
      res.json(rows);
    });
  });
  




router.post('/getDataFromID', (req, res) => {

const employee_ID=req.body.employee_ID


  db.query(`SELECT * FROM Documents WHERE employee_ID = '${employee_ID}'`, (err, rows) => {
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


      const { id,	document_Name,	file,	employee_ID,	date	
      } = req.body;
  

     

  
      // Insert the new user into the database
      await promiseDb.query(`INSERT INTO Documents (	document_Name,	file,	employee_ID,	date) VALUES ('${document_Name}', '${file}', '${employee_ID}', '${date}')`);
  
    //   // Create and return a JWT
      return res.json('added');
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });










  
  module.exports=router