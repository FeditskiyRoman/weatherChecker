(function (angular) {
	var app = angular.module('app');

	app.controller('weatherListCtrl', ctrl);

	ctrl.$inject = [
		'$mdDialog',
		'$mdToast',
		'$location',
		'weatherListService'
	];
	function ctrl(
		$mdDialog,
		$mdToast,
		$location,
		weatherListService
	) {
		var vm = this;

		getWeatherList();

		var confirmDeletePopup = $mdDialog.confirm({
			title: 'Are you shure?',
			textContent: 'This action can`t be undone',
			ok: 'Delete',
			cancel: 'Cancel'
		});

		vm.data = [];

		vm.openCity = function(id) {
			$location.path('/city/' + id);
		};

		vm.onDelete = function(id) {
			$mdDialog
				.show( confirmDeletePopup ).then(function() {
					weatherListService.delete(id).then(function() {
						getWeatherList();
						$mdToast.show(
							$mdToast.simple()
								.textContent('Recepie deleted!')
								.position('bottom center')
								.hideDelay(3000)
						);
					});
				})
		};

		vm.onAdd = function() {
			$location.path('/city');
		};

		function getWeatherList() {
			weatherListService.getAll().then(function(data) {
				vm.data = data;
			});
		}
	}
})(angular);