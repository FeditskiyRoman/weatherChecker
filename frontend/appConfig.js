'use strict';

(function(angular) {
	var app = angular.module('app');

	app.config(config);
	config.$inject = [
		'$routeProvider',
		'$httpProvider'
	];

	function config(
		$routeProvider,
		$httpProvider
	) {
		$httpProvider.interceptors.push('Interceptor');

		$routeProvider.when('/weather-list', {
			controller: 'weatherListCtrl',
			controllerAs: 'vm',
			templateUrl: 'weather-list/tpl.html'
		}).when('/city/:id?', {
			controller: 'addEditCtrl',
			controllerAs: 'vm',
			templateUrl: 'addEditPage/tpl.html'
		}).when('/', {
			redirectTo: '/weather-list'
		}).otherwise({ redirectTo: '/weather-list' });
	}
})(angular);