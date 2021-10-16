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

router.post('/', (req, res) => {
    console.log('in router.post');
    
    const newTask = req.body;
    console.log('this is req.body as newTask: ', newTask);
    console.log('this is newTask.task: ', newTask.task);
    
    let queryText = `
    INSERT INTO "todo" ("task", "due_date", "priority")
    VALUES ($1, $2, $3);
    `
    pool.query(queryText, [newTask.task, newTask.due_date, newTask.priority])
        .then((result) => {
            console.log('Task Added: ', result);
            res.sendStatus(201)
        }).catch((err) => {
            console.log('Error adding new Task: ', err);
            res.sendStatus(500)
        })
})

router.put('/:id', (req, res) => {
    let id = req.params.id;
    let queryText = `
        UPDATE "todo"
        SET "completed_date" = NOW()
        WHERE "id" = $1;
    `
    pool.query(queryText, [id])
        .then(() => {
            res.sendStatus(200)
        }).catch(() => {
            res.sendStatus(500)
        })
})

module.exports = router;