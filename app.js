var express = require('express');
var app = express();

app.get('/hello', function (req, res) {
    res.send('hello world');
});

app.post('/webhook', function (req, res) {
    res.send('hello !!!!!');
});

app.listen(process.env.PORT);
