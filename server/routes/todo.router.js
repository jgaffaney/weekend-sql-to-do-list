const express = require('express');
const router = express.Router();
const pool = require('../modules/pool.js')

router.get('/', (req, res) => {
    console.log('in todo.router GET');
    let queryText = `
    SELECT * FROM "todo";
    `
    pool.query(queryText)
        .then((result) => {
            res.send(result.rows);
        }).catch((err) => {
            console.log('Error on GET to DB: ', err);
            res.sendStatus(500);
        })
})

module.exports = router;