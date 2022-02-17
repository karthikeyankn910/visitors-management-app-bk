const express = require('express');
const dotEnv = require('dotenv').config();


const app = express();


app.get('/', (req, res) => {
    res.send("Yes it's working");
})


app.listen(process.env.PORT, () => {
    console.log("Server listening at " + process.env.PORT);
})
