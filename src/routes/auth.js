const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const  {promiseDb} = require('../utils/db');
const router = express.Router();
require('dotenv').config();


router.post('/register', async (req, res) => {
    try {
      // Get data from request body


      const {id, email, full_Name, password, phone, relation, relative_Name, address, department_ID, location_ID, joining_Date, resigning_Date, basic_pay, hra, ta, ctc, pf_Applicable, esi_Applicable } = req.body;
  

      // Check if user already exists
      const [rows]  = await promiseDb.query(`SELECT * FROM Employees WHERE email = '${email}'`);
 
      if (rows.length > 0) {
        return res.status(409).json({ error: 'User already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Insert the new user into the database
      await promiseDb.query(`INSERT INTO Employees (id,email, full_Name, password, phone, relation, relative_Name, address, department_ID, location_ID, joining_Date, resigning_Date, basic_pay, hra, ta, ctc, pf_Applicable, esi_Applicable) VALUES (${id},'${email}', '${full_Name}', '${hashedPassword}', '${phone}', '${relation}', '${relative_Name}', '${address}', ${department_ID}, ${location_ID}, '${joining_Date}', ${resigning_Date ? `'${resigning_Date}'` : 'NULL'}, ${basic_pay}, ${hra}, ${ta}, ${ctc}, '${pf_Applicable}', '${esi_Applicable}')`);

  
    //   // Create and return a JWT
    const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '30d' });

      return res.json({ token });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


  router.post('/login', async (req, res) => {
    // Get email and password from request body
    const { email, password } = req.body;
  // console.log(email)
    try {
      // Retrieve user from database
      const [rows]  = await promiseDb.query(`SELECT * FROM Employees WHERE email = '${email}'`);

  
      // Check if user exists
      if (rows.length == 0) {
        return res.json({ error: 'Invalid email or password' });
      }else{
        // console.log(rows[0])

        // Compare submitted password to hashed password
        const isMatch = await bcrypt.compare(password, rows[0].password);
    
        // If passwords match, generate JWT
        if (isMatch) {
          const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '24h' });
          return res.json({ token });
        } else {
          return res.status(401).json({ error: 'Invalid email or password' });
        }
      }
  
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  


  module.exports = router;


