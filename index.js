/*
	## mongoose for DB connection
	## bluebird for mongoose promise
	## body parser for get input value from front end
*/
var express = require("express");
const socket = require('socket.io');
var app = express();
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
global.basePath = __dirname;
mongoose.Promise = require('bluebird');

var bodyParser = require('body-parser');

var db = require('./app/config/db');
var ApiRoutes = require('./app/apiRoutes');

/* for https */
var fs = require('fs');
var http = require('http');
var https = require('https');
// var privateKey = fs.readFileSync('privatekey.pem', 'utf8');
// var certificate = fs.readFileSync('certificate.pem', 'utf8');
// var credentials = { key: privateKey, cert: certificate };
var httpServer = http.createServer(app);
// var httpsServer = https.createServer(credentials, app);

// Set header
app.use(function (req, res, next) {

	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', '*');

	// Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

	// Request headers you wish to allow
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, x-access-token, production-mode');

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.setHeader('Access-Control-Allow-Credentials', true);

	// Pass to next layer of middleware
	next();
}
);

app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));

// parse application/json
app.use(bodyParser.json({ limit: '50mb' }));

// parse application/x-www-form-urlencoded

app.use('/upload', express.static(__dirname + '/upload'));

new ApiRoutes().routes(app);

const server = app.listen(port);
//httpServer.listen(8443);
//httpsServer.listen(8080);
let io = socket(server);
new ApiRoutes().webSocket(io);
