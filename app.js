var express = require('express');
var app = express();

app.get('/hello', function (req, res) {
    res.send('hello world');
});

app.post('/webhook', function (req, res) {
    res.send('hello !!!!!');
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on', http.address().port);
});