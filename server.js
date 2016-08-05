const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');

const app = express();
const server = require('http').Server(app);
const socketio = require('socket.io');
const io = socketio(server);

app.use(bodyParser.json());

app.use(serveStatic('app'));

app.engine('.html', require('ejs').__express);
app.set('views', './views');
app.set('view engine', 'html');

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/alert', (req, res) => {
    console.log('/alert:', req.body);
   io.emit('alerts', req.body);
    res.status(200).send('OK');
});

io.on('connection', socket => {
    console.log('Connection of socket', socket.id);
    socket.emit('welcome', {});
});

app.set('port', process.env.PORT || 3000);
server.listen(app.get("port"), () => console.log('AirVantage alert webhook app listening on port', app.get("port"), '\\o/'));
