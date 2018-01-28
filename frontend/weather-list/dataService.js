'use strict';
(function(angular) {
	var app = angular.module('app');

	app.service('weatherListService', service);

	service.$inject = [
		'$http',
		'$q',
		'localStorageService'
	];
	function service($http, $q, localStorageService) {

		const key = 'weather-data';

		this.getAll = function () {
			return $q(function(resolve, reject) {
				let data = localStorageService.get(key);
				if (!data) {
					data = {};
				}

				resolve(data);
			});
		};

		this.add = function (data) {
			return $q(function(resolve, reject) {
				let storeData = localStorageService.get(key);

				if (storeData) {
					storeData[data.id] = data;
				} else {
					storeData = {
						[data.id]: data
					};
				}

				localStorageService.set(key, storeData) ? resolve() : reject();
			});
		};

		this.getPlaces = function (data) {
			return $http.post('/api/place', JSON.stringify(data));
		}

		this.getWeather = function(data) {
			return $http.post('/api/weather', JSON.stringify(data));
		}

		this.getById = function (id) {
			return $q(function(resolve, reject) {
				let storeData = localStorageService.get(key);

				if (storeData && storeData[id]) {
					resolve(storeData[id]);
				} else {
					reject();
				}
			});
		};

		this.delete = function (id) {
			return $q(function(resolve, reject) {
				let storeData = localStorageService.get(key);

				delete storeData[id];
				localStorageService.set(key, storeData) ? resolve() : reject();
			});
		};

		this.update = function (data) {
			return $q(function(resolve, reject) {
				let storeData = localStorageService.get(key);

				if (storeData) {
					storeData[data.id] = data;
				} else {
					storeData = {
						[data.id]: data
					};
				}

				localStorageService.set(key, storeData) ? resolve() : reject();
			});
		};

		this.generateRandom = function() {
			return new Date().getTime() + Math.random();
		}
	}
})(angular);