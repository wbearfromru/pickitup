'use strict';

/* Controllers */
var phonecatControllers = angular.module('phonecatControllers', []);

phonecatControllers.controller('NavigationCtrl', [ '$scope', '$window', 'AuthService', function($scope, $window, AuthService) {
	$scope.AuthService = AuthService;
} ]);


phonecatControllers.controller('PhoneListCtrl', [ '$scope', '$window', 'AuthService', function($scope, $window, AuthService) {
	$scope.AuthService = AuthService;
} ]);

phonecatControllers.controller('PhoneDetailCtrl', [ '$scope', '$routeParams', 'Phone', function($scope, $routeParams, Phone) {
	$scope.phone = Phone.get({
		phoneId : $routeParams.phoneId
	}, function(phone) {
		$scope.mainImageUrl = phone.images[0];
	});

	$scope.setImage = function(imageUrl) {
		$scope.mainImageUrl = imageUrl;
	}
} ]);


phonecatControllers.controller('LoginCtrl', [ '$scope', '$routeParams', '$window', 'AuthService', function($scope, $http, $window, AuthService) {
	$scope.credentials = {
		username : '',
		password : ''
	};
	$scope.login = function(credentials) {
		AuthService.login(credentials).
		then(function (data) {
			$window.sessionStorage.isAuthenticated = true;
	        $scope.status = 'Success';
	        $scope.data = data;
	        $window.location = '#/home';
	    }, function (data) {
	    	delete $window.sessionStorage.isAuthenticated; 
	    });
	};
} ]);
