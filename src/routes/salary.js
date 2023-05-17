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
  

    db.query('SELECT * FROM Employees', (err, employees) => {
      if (err) {
        console.log('Error fetching data: ' + err);
        return res.sendStatus(500);
      }
     console.log(employees)
    const employeeCount = employees.length;
      let processedEmployees = 0;
  
      employees.forEach((employee) => {
        const employeeId = employee.id;
  
        db.query(
          'SELECT * FROM attendance WHERE employee_ID = ? AND MONTH(date) = ? AND YEAR(date) = ?',
          [employeeId, currentMonth, currentYear],
          (err, result) => {
            if (err) throw err;
            console.log(result)
            const presentDays = result.length;
            const workingDays = req.body.workingDays;
  
            const extraDays = result.reduce(
              (arr, curr) => {
                if (curr.attendance_status === "late") {
                  arr.lates = arr.lates + 1;
                } else if (curr.attendance_status === "half_day") {
                  arr.half_day = arr.half_day + 1;
                } else if (curr.attendance_status === "short_leave") {
                  arr.short_leave = arr.short_leave + 1;
                }
            
                return arr; // Return the accumulator
              },
              {
                lates: 0,
                half_day: 0,
                short_leave: 0,
              }
            );
          console.log(extraDays)

          const extraAbsent =
  (Number(extraDays.lates) / 3).toFixed(0) +
  (Number(extraDays.half_day) / 2).toFixed(0) +
  (Number(extraDays.short_leave) / 3).toFixed(0);


            const absents = Number(workingDays) - Number(presentDays)+Number(extraAbsent)
            const salaryFactor = Number(presentDays) / Number(workingDays);
  
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
  
            db.query('INSERT INTO Salary SET ?', salary, (err, result) => {
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









  //   promiseDb.query('SELECT * FROM Employees', (err, employees) => {
  //     if (err) throw err;
  // console.log(employees)
  //     // const employeeCount = employees.length;
  //     // let processedEmployees = 0;
  
  //     // employees.forEach((employee) => {
  //     //   const employeeId = employee.id;
  
  //     //   promiseDb.query(
  //     //     'SELECT * FROM Attendance WHERE employee_ID = ? AND MONTH(date) = ? AND YEAR(date) = ?',
  //     //     [employeeId, currentMonth, currentYear],
  //     //     (err, result) => {
  //     //       if (err) throw err;
  //     //       const presentDays = result[0].length;
  //     //       const workingDays = req.body.workingDays;
  
  //     //     const extraDays=  result[0].reduce((arr,curr)=>{

  //     //       if(curr.attendance_status==="late"){
  //     //         acc.lates=acc.lates+1
  //     //       }
  //     //       else if(curr.attendance_status==="half_day"){
  //     //         acc.half_day=acc.half_day+1

  //     //       }
  //     //       else if(curr.attendance_status==="short_leave"){
  //     //         acc.short_leave=acc.short_leave+1

  //     //       }


  //     //     },{
  //     //       lates:0,
  //     //       half_day:0,
  //     //       short_leave:0
  //     //     })

  //     //     const extraAbsent=(extraDays.lates/3).toFixed(0)+(extraDays.half_day/2).toFixed(0)+(extraDays.short_leave/3).toFixed(0)

  //     //       const absents = workingDays - presentDays+extraAbsent
  //     //       const salaryFactor = presentDays / workingDays;
  
  //     //       const salary = {
  //     //         month: currentMonth,
  //     //         year: currentYear,
  //     //         employee_ID: employeeId,
  //     //         working_Days: workingDays,
  //     //         absents: absents,
  //     //         presents: presentDays,
  //     //         lates: 0, // Assuming no late days, you can modify this according to your requirement
  //     //         basic_Pay: employee.basic_Pay * salaryFactor,
  //     //         hra: employee.hra * salaryFactor,
  //     //         ta: employee.ta * salaryFactor,
  //     //         pf: employee.pf_Applicable ? (employee.basic_Pay * 12) / 100 * salaryFactor : 0,
  //     //         esi: employee.esi_Applicable ? (employee.basic_Pay * 1.75) / 100 * salaryFactor : 0,
  //     //         ctc: employee.ctc * salaryFactor,
  //     //       };
  
  //     //       promiseDb.query('INSERT INTO Salary SET ?', salary, (err, result) => {
  //     //         if (err) throw err;
  //     //         console.log(`Salary calculated for employee with ID: ${employeeId}`);
  //     //       });
  
  //     //       calculatedSalaries.push(salary);
  //     //       processedEmployees++;
  
  //     //       if (processedEmployees === employeeCount) {
  //     //         res.json(calculatedSalaries);
  //     //       }
  //     //     },
  //     //   );
  //     // });
  //   });
  });

  






  
  module.exports=router