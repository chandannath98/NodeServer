const express = require('express');
const bodyParser = require('body-parser');
const promiseDb = require('../utils/db');
const {db} = require('../utils/db');
const checkAuth = require('./middlewares/checkAuth');
const app=express()
const router = express.Router();

app.use(bodyParser.json());


router.use(checkAuth)

router.get('/', (req, res) => {
    db.query('SELECT * FROM Employees', (err, rows) => {
      if (err) {
        console.log('Error fetching data: ' + err);
        return res.sendStatus(500);
      }
      res.json(rows.map(obj=>{
        let {password, ...others} = obj; 
        return others;
      }));
    });
  });
  
  
  
  router.put('/alter', (req, res) => {
      const data = req.body;
      const email = req.params.email;
      db.query('UPDATE Employees SET ? WHERE email = ?', [data, email], (err) => {
        if (err) {
          console.log('Error updating data: ' + err);
          return res.sendStatus(500);
        }
        res.sendStatus(200);
      });
    });

    module.exports = router;


    
  