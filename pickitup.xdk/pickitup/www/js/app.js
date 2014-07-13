'use strict';

/* App Module */
var pickitupApp = angular.module('pickitup', [
  'ngRoute',
  'controllers',
  'filters',
  'services'
]);

pickitupApp.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/home', {
		templateUrl : 'partials/home.html',
		controller : 'HomeCtrl'
	}).when('/signup', {
		templateUrl : 'partials/signup.html',
		controller : 'SignUpCtrl'
	}).when('/login', {
		templateUrl : 'partials/login.html',
		controller : 'LoginCtrl'
	}).when('/me', {
		templateUrl : 'partials/me.html',
		controller : 'MyProfileCtrl'
	}).when('/nearme', {
		templateUrl : 'partials/nearme.html',
		controller : 'NearMeCtrl'
	}).when('/creategame', {
		templateUrl : 'partials/creategame.html',
		controller : 'CreateGameCtrl'
	}).when('/game/:uniqueId', {
		templateUrl : 'partials/game.html',
		controller : 'GameDetailCtrl'
	}).when('/player/:uniqueId', {
		templateUrl : 'partials/player.html',
		controller : 'PlayerDetailCtrl'
	}).otherwise({
		redirectTo : '/home'
	});
} ]);

pickitupApp.factory('AuthInterceptor',  ['$rootScope', '$q', '$window', function($rootScope, $q, $window) {
	return {
		request : function(config) {
			config.headers = config.headers || {};
			if ($window.sessionStorage.token) {
				config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
			}
			return config;
		},
		response : function(response) {
			if (response.status === 401) {
				// handle the case where the user is not authenticated
			}
			return response || $q.when(response);
		}
	};
}]);

pickitupApp.config(function($httpProvider) {
	$httpProvider.interceptors.push('AuthInterceptor');
});

pickitupApp.run(function ($rootScope) {
    $rootScope.$on('$locationChangeSuccess', function (event, newUrl, oldUrl) {
    	var url = newUrl.substring(newUrl.indexOf('#')+1);
    	console.log(url);
    	switch (url){
    	case '/creategame':
    		$rootScope.currentpage = 'Create game';
    		break;
    	case '/nearme':
    		$rootScope.currentpage = 'Near me';
    		break;
    	case '/me':
    		$rootScope.currentpage = 'Me';
    		break;
    	default:
    		$rootScope.currentpage = 'Pick it up!';
    		break;
    	}
    });
});

