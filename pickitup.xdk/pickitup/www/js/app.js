'use strict';

/* App Module */
var phonecatApp = angular.module('phonecatApp', [
  'ngRoute',
  'phonecatControllers',
  'phonecatFilters',
  'phonecatServices'
]);

phonecatApp.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/home', {
		templateUrl : 'partials/home.html',
		controller : 'HomeCtrl'
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
	}).when('/phones/:phoneId', {
		templateUrl : 'partials/phone-detail.html',
		controller : 'PhoneDetailCtrl'
	}).otherwise({
		redirectTo : '/home'
	});
} ]);

