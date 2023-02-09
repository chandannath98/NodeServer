const express = require('express');
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.json());


const authRouter= require("./src/routes/auth");
const employees= require("./src/routes/employeeRoute");
const department= require("./src/routes/department");
const location= require("./src/routes/location");
const salary= require("./src/routes/salary");
const attendence= require("./src/routes/attendence");

app.use('/auth', authRouter);
app.use('/employees', employees);
app.use('/department', department);
app.use('/location', location);
app.use('/salary', salary);
app.use('/attendence', attendence);
 



app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
