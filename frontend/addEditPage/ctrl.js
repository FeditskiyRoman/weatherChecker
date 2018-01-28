(function (angular) {
	var app = angular.module('app');

	app.controller('addEditCtrl', ctrl);

	ctrl.$inject = [
		'$routeParams',
		'$mdToast',
		'$q',
		'$location',
		'$timeout',
		'weatherListService'
	];
	function ctrl(
		$routeParams,
		$mdToast,
		$q,
		$location,
		$timeout,
		weatherListService
	) {
		var vm = this;

		vm.data = {};
		vm.searchText = null;
		vm.selectedItem = null;
		vm.querySearch = querySearch;

		if ($routeParams.id) {
			vm.title = 'Edit your city';
			weatherListService.getById($routeParams.id).then(function(data) {
				vm.data = data;
				vm.searchText = data.city;
			});

			vm.save = function() {
				vm.data.update = Date.now();
				weatherListService.update(vm.data).then(function() {
					$location.path('/weather-list');
					showToast();
				});
			}
		} else {
			vm.title = 'Add your city';

			vm.save = function() {
				vm.data.id = weatherListService.generateRandom();
				vm.data.update = Date.now();
				weatherListService.add(vm.data).then(function() {
					$location.path('/weather-list');
					showToast();
				});
			}
		}

		vm.getWeather = function () {
			if (vm.selectedItem) {
				var arr = vm.selectedItem.value.split(',');
				vm.data.city = arr[0];
				vm.data.country = arr[arr.length - 1];

				weatherListService.getWeather({
					city: vm.selectedItem.id
				}).then(function(res) {
					vm.data.temperature = res.data.main.temp / 32;
					vm.data.humidity = res.data.main.humidity;
				});
			}
		}

		vm.back = function() {
			$location.path('/weather-list');
		}

		function querySearch (query) {
			var results = [];
			weatherListService.getPlaces({
				place: query
			}).then(function(res) {
				return res.data.descriptions.forEach(function(item) {
					results.push({
						value: item.description,
						display: item.description,
						id: item.id
					});
				});
			});

			var deferred = $q.defer();
			$timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
			return deferred.promise;
		}

		function showToast() {
			$mdToast.show(
				$mdToast.simple()
					.textContent('Saved successfully!')
					.position('bottom center')
					.hideDelay(3000)
			);
		}
	}
})(angular);