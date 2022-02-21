const express = require('express');
const { Employee } = require('../db_conn/db');

const router = express.Router();


router.get('/', (req, res) => {
    res.send('I am from employee');
})


module.exports = router;