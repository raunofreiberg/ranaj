const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

app.use(bodyParser.json());

app.listen(process.env.PORT);

app.get('/hello', function (req, res) {
    res.send('hello world');
});

app.get('/webhook', function (req, res) {
	if (req.query['hub.verify_token'] === 'beniz') {
		res.send(req.query['hub.challenge']);
        console.log('done');
	}
	res.send('Error, wrong token');
    console.log('fuck');
});

app.post('/webhook', function (req, res) {
    let messaging_events = req.body.entry[0].messaging;
    for (let i = 0; i < messaging_events.length; i++) {
	    let event = req.body.entry[0].messaging[i];
	    let sender = event.sender.id;
	    if (event.message && event.message.text) {
		    let text = event.message.text;

		    if (text === 'Generic') {
		    		sendGenericMessage(sender);
		    	continue
			}
		    sendTextMessage(sender, text)
	    }
    }
    res.sendStatus(200)
});

const token = 'EAAD2EIPvxu0BAPYULJz85kD8ZC0faU2u3DqI4Q2v0hm3gw4eSk19LsLeIZAutVcMgaGbHknT9ZCZBdpZCpk5ZALHjCd8uWvXhObKdfMWhjifDdRlGQg7dObKXkYGKPme32ufTwhdKTk1Fw5b7VM0yE13JNWZBZBCRnnvBZAF7ZBkT5YNMvdYRZAY4wO';

function sendTextMessage(sender, text) {
    let messageData = { text:text };
    request({
	    url: 'https://graph.facebook.com/v2.6/me/messages',
	    qs: {access_token:token},
	    method: 'POST',
		json: {
		    recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
		    console.log('Error sending messages: ', error)
		} else if (response.body.error) {
		    console.log('Error: ', response.body.error)
	    }
    })
}

function sendGenericMessage(sender) {
    let messageData = {
	    "attachment": {
		    "type": "template",
		    "payload": {
				"template_type": "generic",
			    "elements": [{
					"title": "First card",
				    "subtitle": "Element #1 of an hscroll",
				    "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
				    "buttons": [{
					    "type": "web_url",
					    "url": "https://www.messenger.com",
					    "title": "web url"
				    }, {
					    "type": "postback",
					    "title": "Postback",
					    "payload": "Payload for first element in a generic bubble",
				    }],
			    }, {
				    "title": "Second card",
				    "subtitle": "Element #2 of an hscroll",
				    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
				    "buttons": [{
					    "type": "postback",
					    "title": "Postback",
					    "payload": "Payload for second element in a generic bubble",
				    }],
			    }]
		    }
	    }
    };
    request({
	    url: 'https://graph.facebook.com/v2.6/me/messages',
	    qs: {access_token:token},
	    method: 'POST',
	    json: {
		    recipient: {id:sender},
		    message: messageData,
	    }
    }, function(error, response, body) {
	    if (error) {
		    console.log('Error sending messages: ', error)
	    } else if (response.body.error) {
		    console.log('Error: ', response.body.error)
	    }
    })
}