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
  db.query('SELECT * FROM Department', (err, rows) => {
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


      const { id,department_Name,working_days_in_week,leave_Days,in_Timing,out_Timing } = req.body;
  

      // Check if user already exists
      const [rows]  = await promiseDb.query(`SELECT * FROM Department WHERE id = '${id}'`);
 
      if (rows.length != 0) {
        return res.status(409).json({ error: 'Department exists' });
      }
  
      // Hash the password

  
      // Insert the new user into the database
      await promiseDb.query(`INSERT INTO Department (id,department_Name,working_days_in_week,leave_Days,in_Timing,out_Timing) VALUES ('${id}', '${department_Name}', ${working_days_in_week}, ${leave_Days}, '${in_Timing}', '${out_Timing}')`);
  
    //   // Create and return a JWT
      return res.json('added');
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });



  router.put('/alter', (req, res) => {
    const data = req.body;
    const id = req.body.id;
    try{
      promiseDb.query('UPDATE Department SET ? WHERE id = ?', [data, id])
      return res.sendStatus(200);

    }catch(eror){
    
        console.log('Error updating data: ' + err);
        return res.sendStatus(500);
      

      
    }
  });









  
  module.exports=router