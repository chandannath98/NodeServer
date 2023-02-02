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
  db.query('SELECT * FROM Salary', (err, rows) => {
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


      const { id,month,year,email,working_Days,absents,presents,lates,half_day,basic_Pay,hra,ta,pf,esi,ctc} = req.body;
  

      // Check if user already exists
      const [rows]  = await promiseDb.query(`SELECT * FROM Salary WHERE id = '${id}'`);
 
      if (rows.length != 0) {
        return res.status(409).json({ error: 'Salary exists' });
      }
  
      // Hash the password

  
      // Insert the new user into the database
      await promiseDb.query(`INSERT INTO Salary ( id,month,year,email,working_Days,absents,presents,lates,half_day,basic_Pay,hra,ta,pf,esi,ctc) VALUES ('${id}', ${month}, ${year},  '${email}', ${working_Days}, ${absents}, ${presents}, ${lates}, ${half_day}, ${basic_Pay}, ${hra}, ${ta}, ${pf}, ${esi}, ${ctc})`);
  
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
      promiseDb.query('UPDATE Salary SET ? WHERE id = ?', [data, id])
      return res.sendStatus(200);

    }catch(eror){
    
        console.log('Error updating data: ' + err);
        return res.sendStatus(500);
      

      
    }
  });









  
  module.exports=router