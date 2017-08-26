var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());

app.listen(process.env.PORT);

app.get('/hello', function (req, res) {
    res.send('hello world');
});

app.get('/webhook', function (req, res) {
	if (req.query['hub.verify_token'] === 'poop') {
		res.send(req.query['hub.challenge']);
        console.log('done');
	}
	res.send('Error, wrong token');
    console.log('fuck');
});