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
            resultArray = result.rows;
            console.log('resultArray is: ', resultArray);
            // declare today's date
            // declare an object for sending
            let today = new Date();
            let obj = {
                completed: [],
                soon: [],
                today: []
            }
            // console.log('This is today:', today);
            // separate tasks by date
            for(item of resultArray) {
                if(item.completed_date) {
                    obj.completed.push(item);                    
                } else if(item.due_date.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)) {
                    obj.today.push(item)
                } else {
                    obj.soon.push(item)
                } 
            }
            // console.log('this is completed object for sending: ', obj);                
            res.send(obj);
        }).catch((err) => {
            console.log('Error on GET to DB: ', err);
            res.sendStatus(500);
        })
})

module.exports = router;