'use strict';

(function(angular) {
	var app = angular.module('app');

	app.factory('Interceptor', Interceptor);
	Interceptor.$inject = ['LoadingService'];

	function Interceptor(LoadingService) {
		var loadingMessage = {
			request: function(request) {
				LoadingService.loadStart()
				return request;
			},
			response: function(response) {
				LoadingService.loadEnd()
				return response;
			},
			responseError: function(response) {
				LoadingService.loadEnd();
			}
		};
		return loadingMessage;
	}
})(angular);