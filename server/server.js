const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5000;
const router = require('./routes/todo.router.js');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('server/public'))

app.listen(PORT, () => {
    console.log('Listening on PORT: ', PORT);
})

app.use('/todo', router)