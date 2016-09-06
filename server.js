"use strict";

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');

// Configuration file
const configuration = require('./config');
// AirVantage API wrapper
const AirVantage = require('airvantage');
// Simplified HTTP requests
const got = require('got');

// Create the web app server + socket.io setup
const app = express();
const server = require('http').Server(app);
const socketio = require('socket.io');
const io = socketio(server);

// In memory clients storage
let clients = {};

// Express webapp setup
app.use(bodyParser.json());
app.engine('.html', require('ejs').__express);
app.set('views', './views');
app.set('view engine', 'html');

// "/" route that displays what is received thru the webook
app.get('/', (req, res) => res.render('index'));

// Webhook route
app.post('/alert', (req, res) => {

    // Sample JSON sent to the webhook
    // {
    //     "name": "event.alert.rule.triggered",
    //     "date": 1473091118798,
    //     "content": {
    //         "alert.uid": "e3cf3fed7d9c41beb33facbffaca6504",
    //         "rule.uid": "35b00600117d4cb58437eccd0935a305",
    //         "target.uid": "88e085b6012a408f9e2582b89a3b7161"
    //     }
    // }

    const alertState = req.body.content,
        alertRuleUid = alertState["rule.uid"],
        alertUid = alertState["alert.uid"],
        systemUid = alertState["target.uid"];

    // Loop thru the list of connected clients
    _.each(clients, (token, socketId) => {
        let alertRule, alertDetails, system;

        // Clients may have not provided an AirVantage token in the url
        // Just display send the raw JSON
        if (!token) {
            io.sockets.connected[socketId].emit('alerts', {
                content: req.body
            });
        } else {
            // Otherwise make additional AirVantage API calls to get more details
            const airvantage = new AirVantage({
                serverUrl: configuration.airvantageHost
            });
            airvantage.authenticate({
                    token: token
                })
                .then(() => airvantage.getDetailsAlertRule(alertRuleUid))
                .then(res => alertRule = res)
                .then(() => airvantage.getDetailsAlert(alertUid))
                .then(res => alertDetails = res)
                .then(() => airvantage.getDetailsSystem(systemUid))
                // Finally send to the client all compiled data
                .then(system => io.sockets.connected[socketId].emit('alerts', {
                    alertRule: alertRule,
                    alertDetails: alertDetails,
                    system: system,
                    content: req.body
                }))
                .catch(res => {
                    // In case of an error, simply send the raw JSON
                    console.error(res);
                    io.sockets.connected[socketId].emit('alerts', {
                        content: req.body
                    });
                });
        }
    });
    res.status(200).send('OK');
});

/**
 * How many connected clients
 */
function getNbClients() {
    return Object.keys(clients).length;
}

// Socket.io setup
io.on('connection', socket => {
    // Get the possible AirVantage token that will be used to get more details on the received alerts
    const token = socket.request._query["token"];
    // Store it
    const clientId = socket.id;
    clients[clientId] = token;
    const nbClients = getNbClients();

    console.log("New client connected with id:", clientId, "and token:", token);
    console.log(nbClients, "client(s) connected");

    // Handshake with the new client
    socket.emit('welcome', nbClients);
    // Inform every clients that someone just connected
    io.emit('updateNbClients', nbClients);

    // Handle client disconnection
    socket.on('disconnect', () => {
        delete clients[clientId];
        console.log("Someone just left");
        console.log(getNbClients(), "client(s) connected");
        // Inform everyone that someone just left
        io.emit('updateNbClients', getNbClients())
    });
});

app.set('port', process.env.PORT || 3000);
server.listen(app.get("port"), () => console.log('AirVantage alert webhook app listening on port', app.get("port"), '\\o/'));
