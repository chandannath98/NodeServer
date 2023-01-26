const express = require('express');
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.json());


const authRouter= require("./src/routes/auth");
const employees= require("./src/routes/employeeRoute");

app.use('/auth', authRouter);
app.use('/employees', employees);
 



app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
