const express = require('express');
const { Branch } = require('../db_conn/db');

const router = express.Router();


router.get('/', (req, res) => {
    res.send('I am from branch');
})


module.exports = router;