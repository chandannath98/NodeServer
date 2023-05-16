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


  
router.post('/calculate-salary', async (req, res) => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const calculatedSalaries = [];
  
    promiseDb.query('SELECT * FROM Employees', (err, employees) => {
      if (err) throw err;
  
      const employeeCount = employees.length;
      let processedEmployees = 0;
  
      employees.forEach((employee) => {
        const employeeId = employee.id;
  
        promiseDb.query(
          'SELECT COUNT(*) AS presentDays FROM Attendance WHERE employee_ID = ? AND MONTH(date) = ? AND YEAR(date) = ?',
          [employeeId, currentMonth, currentYear],
          (err, result) => {
            if (err) throw err;
            const presentDays = result[0].presentDays;
            const workingDays = req.body.workingDays;
  
            const absents = workingDays - presentDays;
            const salaryFactor = presentDays / workingDays;
  
            const salary = {
              month: currentMonth,
              year: currentYear,
              employee_ID: employeeId,
              working_Days: workingDays,
              absents: absents,
              presents: presentDays,
              lates: 0, // Assuming no late days, you can modify this according to your requirement
              basic_Pay: employee.basic_Pay * salaryFactor,
              hra: employee.hra * salaryFactor,
              ta: employee.ta * salaryFactor,
              pf: employee.pf_Applicable ? (employee.basic_Pay * 12) / 100 * salaryFactor : 0,
              esi: employee.esi_Applicable ? (employee.basic_Pay * 1.75) / 100 * salaryFactor : 0,
              ctc: employee.ctc * salaryFactor,
            };
  
            promiseDb.query('INSERT INTO Salary SET ?', salary, (err, result) => {
              if (err) throw err;
              console.log(`Salary calculated for employee with ID: ${employeeId}`);
            });
  
            calculatedSalaries.push(salary);
            processedEmployees++;
  
            if (processedEmployees === employeeCount) {
              res.json(calculatedSalaries);
            }
          },
        );
      });
    });
  });

  






  
  module.exports=router