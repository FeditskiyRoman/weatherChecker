'use strict';

// External
const _ = require('lodash');
const Promise = require('promise');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');

// Internal
const config = require('./config.js');
const routing = require('./routing/routes');
module.exports = function () {
	startServer();
};

function startServer() {
	var app = express();
	
	app.use(bodyParser.urlencoded({extended: true}));
	app.use(bodyParser.json());
	app.use(routing);

	app.listen(config.server.port, function(){
		showSuccessMessage(app);
	});
}

function showSuccessMessage(app) {
	console.log('Server running at: ' + config.server.port);
}