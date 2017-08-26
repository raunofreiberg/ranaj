'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const fetch = require('node-fetch');
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
    let data = req.body;

    // Make sure this is a page subscription
    if (data.object === 'page') {

        // Iterate over each entry - there may be multiple if batched
        data.entry.forEach(function (entry) {
            let pageID = entry.id;
            let timeOfEvent = entry.time;

            // Iterate over each messaging event
            entry.messaging.forEach(function (event) {
                if (event.message) {
                    receivedMessage(event);
                } else {
                    console.log("Webhook received unknown event: ", event);
                }
            });
        });

        res.sendStatus(200);
    }
});

const sendMemeGif = senderID => {
    fetch(
        "https://api.giphy.com/v1/gifs/random?tag=meme&api_key=afb98db1dd844c6c841d9e573ef0ef27&limit=1"
    )
        .then(res => res.json())
        .then(data => sendMemeMessage(senderID, data.data.image_url));
};

function receivedMessage(event) {
    let senderID = event.sender.id;
    let recipientID = event.recipient.id;
    let timeOfMessage = new Date(event.timestamp);
    let message = event.message;

    console.log("Received message for user %d and page %d at %d with message:",
        senderID, recipientID, timeOfMessage);
    console.log(JSON.stringify(message));

    let messageId = message.mid;

    let messageText = message.text;
    let messageAttachments = message.attachments;

    if (messageText) {

        // If we receive a text message, check to see if it matches a keyword
        // and send back the example. Otherwise, just echo the text we received.
        switch (messageText) {
            case 'meme':
                sendMemeGif(senderID);
                break;
            case 'thetime':
                sendTextMessage(senderID, timeOfMessage);
                break;

            default:
                sendTextMessage(senderID, messageText);
        }
    } else if (messageAttachments) {
        sendTextMessage(senderID, "Message with attachment received");
    }
}

function sendTextMessage(recipientId, messageText) {
    let messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: messageText
        }
    };

    callSendAPI(messageData);
}

function sendMemeMessage(recipientId, memeUrl) {
    let messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "image",
                payload: {
                    url: memeUrl
                }
            }
        }
    };

    callSendAPI(messageData);
}

const token = 'EAAD2EIPvxu0BAPYULJz85kD8ZC0faU2u3DqI4Q2v0hm3gw4eSk19LsLeIZAutVcMgaGbHknT9ZCZBdpZCpk5ZALHjCd8uWvXhObKdfMWhjifDdRlGQg7dObKXkYGKPme32ufTwhdKTk1Fw5b7VM0yE13JNWZBZBCRnnvBZAF7ZBkT5YNMvdYRZAY4wO';

function callSendAPI(messageData) {
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: token },
        method: 'POST',
        json: messageData

    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            let recipientId = body.recipient_id;
            let messageId = body.message_id;

            console.log("Successfully sent generic message with id %s to recipient %s",
                messageId, recipientId);
        } else {
            console.error("Unable to send message.");
            console.error(response);
            console.error(error);
        }
    });
}
