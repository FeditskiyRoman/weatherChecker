'use strict';

const express = require('express');
const request = require('request');
const googlePlaces = require('node-googleplaces');
const router = express.Router();
const config = require('../config.js');
const cityList = require('../files/city.list.js');


//Middle ware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.post('/api/place', function(request, response) {
	const places = new googlePlaces(config.googleApiKey);

	const params = {
		input: request.body.place
	};

	places.autocomplete(params).then(res => response.send(responseParse(res))).catch(err => response.send('err'));
});

router.post('/api/weather', function(req, res) {
	var city = req.body.city;
	var cityObj = cityList.find(item => item.name === city);

	var uri = 'http://samples.openweathermap.org/data/2.5/weather?id=' + cityObj.id + '&APPID=' + config.openWeatherApiKey;

	request({
		method: 'GET',
		uri: uri
	}, (error, response, body) => {
		res.send(body);
	});
});

function responseParse(res) {
	var response = JSON.parse(res.text);
	var data = [];
	var descriptions = response.predictions.forEach((item) => {
		data.push(item.description);
	});

	return {
		data: data,
		descriptions: response.predictions
	};
}


module.exports = router;