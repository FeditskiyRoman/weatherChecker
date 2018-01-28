'use strict';

(function(angular) {
	var app = angular.module('app');

	app.factory('LoadingService', LoadingService);
	LoadingService.$inject = [];

	function LoadingService() {
		var count = 0;
		var startListeners = [];
		var endListeners = [];

		return {
			loadStart: loadStart,
			loadEnd: loadEnd,
			onLoadStart: onLoadStart,
			onLoadEnd: onLoadEnd
		}

		function loadStart() {
			startListeners.forEach(function (listener) {
				listener();
			});
			count++;
		}

		function loadEnd() {
			count--;

			if(count === 0) {
				endListeners.forEach(function (listener) {
					listener();
				});
			}
		}

		function onLoadStart(listener) {
			startListeners.push(listener);
		}

		function onLoadEnd(listener) {
			endListeners.push(listener);
		}
	}
})(angular);