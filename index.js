const express = require('express');
const dotEnv = require('dotenv').config();
const { sequelize } = require('./db_conn/db');


const app = express();


app.get('/', (req, res) => {
    res.send("Yes it's working");
})


sequelize.authenticate()
    .then(() => {
        console.log("DB connected.");
    })
    .catch(() => {
        console.log("DB connection error");
    })


sequelize.sync({force: true}); 

app.listen(process.env.PORT, () => {
    console.log("Server listening at " + process.env.PORT);
})
