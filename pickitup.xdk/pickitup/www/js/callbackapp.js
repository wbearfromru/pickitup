'use strict';

/* App Module */
var pickitupApp = angular.module('pickitup', [
  'services'
]);

pickitupApp.controller('FbCallbackCtrl', [ '$scope', '$window', '$location', 'AuthService', function($scope, $window, $location, AuthService) {
	openFB.init('1432974593617773'); 
    openFB.oauthCallback(requestedUrl, function(){
		openFB.api({
            path: '/me',
            success: function(data) {
            	AuthService.login_fb(data.id).then(function(responsedata) {
        			$window.sessionStorage.token = responsedata.data.token;
        			$window.sessionStorage.isAuthenticated = true;
        			location.href = 'index.html#/home';
        		}, function() {
        			AuthService.signup_fb(data, {data: {}}).then(function(responsedata) {
    					$window.sessionStorage.token = responsedata.data.token;
    					$window.sessionStorage.isAuthenticated = true;
    					location.path("index.html#/home");
    				}, function(){
    					location.href = 'index.html#/login';
    				});
        		});
            },
        	error: function(){
        		location.href = 'index.html?#/login';
            }}); 
	});
} ]);