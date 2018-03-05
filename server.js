//Imports modules
var express = require('express'),
 path = require('path'),
 bodyParser = require('body-parser'),
 routes = require('./server/routes/web');
 
//Creates the express server
var app = express();
 
//Uses application/json by default
app.use(bodyParser.json());
 
//Sets application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
//Sets static files location './app' for angular app html and js
app.use(express.static(path.join(__dirname, 'app')));
//Sets static files location './node_modules'
app.use(express.static('node_modules'));
 
//Configures the routes
app.use('/', routes);
 
//Sets the port number for running server
var port = process.env.port || 3000;
 
//Starts the express server
app.listen(port, function() {
 console.log('The server is running at : http://localhost:' + port);
});