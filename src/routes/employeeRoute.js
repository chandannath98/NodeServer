const express = require('express');
const bodyParser = require('body-parser');
// const promiseDb = require('../utils/db');
const {db,promiseDb} = require('../utils/db');
const checkAuth = require('./middlewares/checkAuth');
const app=express()
const router = express.Router();
const jwt = require('jsonwebtoken');
// const  {promiseDb} = require('../utils/db');



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








    const extractToken = (req) => {
      const authHeader = req.headers['x-access-token']
      // if (authHeader && authHeader.startsWith('Bearer ')) {
      if (authHeader ) {
        console.log(authHeader)
        return authHeader
      }
      return null;
    };
    
    // Endpoint to get user data by matching email ID from token
    router.get('/getUserData', async (req, res) => {
      try {
        const token = extractToken(req);
        if (!token) {
          return res.status(401).json({ error: 'Unauthorized' });
        }
    
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const userEmail = decodedToken.email;
    
        // Retrieve employee data from the database using the userEmail
        const query = ` SELECT E.*, D.*, L.*
        FROM Employees E
        LEFT JOIN Department D ON E.department_ID = D.id
        LEFT JOIN Location L ON E.location_ID = L.id
        WHERE E.email = ?`;
        const [rows] = await promiseDb.query(query, [userEmail]);
    
        if (rows.length === 0) {
          return res.status(404).json({ error: 'Employee not found' });
        }
    
        const employeeData = rows[0]; // Assuming there is only one employee with the given email
    
        return res.json({ data: employeeData });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    });









    module.exports = router;


    
  