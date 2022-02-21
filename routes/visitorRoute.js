const express = require('express');
const { Visitor } = require('../db_conn/db');

const router = express.Router();


router.get('/', (req, res) => {
    res.send('I am from visitor');
})


module.exports = router;