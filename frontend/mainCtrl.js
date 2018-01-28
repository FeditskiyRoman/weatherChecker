(function (angular) {
	'use strict';
	var app = angular.module('app');

	ctrl.$inject = [
		'LoadingService'
	];
	function ctrl(
			LoadingService
		) {
		var vm = this;


		LoadingService.onLoadStart(function () {
			vm.showSpinner = true;
		});

		LoadingService.onLoadEnd(function () {
			vm.showSpinner = false;
		});
	}
	app.controller('mainCtrl', ctrl);
})(angular);