const express = require('express');
const dotEnv = require('dotenv').config();
const { sequelize } = require('./db_conn/db');
const bodyParser = require('body-parser');
const cors = require('cors');
const branchRoute = require('./routes/branchRoute');
const employeeRoute = require('./routes/employeeRoute');
const visitorRoute = require('./routes/visitorRoute');


const app = express();

//middlewares for bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


//middleware for cors policy
app.use(cors({ origin: "http://localhost:3000"}));


//database authentication
sequelize.authenticate()
    .then(() => {
        console.log("DB connected.");
    })
    .catch(() => {
        console.log("DB connection error");
    });
sequelize.sync({}); 


//sample GET request
app.get('/', (req, res) => {
    res.send("Yes it's working...");
});


//middlewares for each models
app.use('/branches', branchRoute);
app.use('/employees', employeeRoute);
app.use('/visitors', visitorRoute);





app.listen(process.env.PORT, () => {
    console.log("Server listening at " + process.env.PORT);
})
