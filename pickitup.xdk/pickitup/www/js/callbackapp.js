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
            	AuthService.login_fb(data.id).then(function(data) {
        			console.log(data);
        			$window.sessionStorage.token = data.data.token;
        			$window.sessionStorage.isAuthenticated = true;
        			location.href = 'index.html#/home';
        		}, function() {
        			location.href = 'index.html#/login';
        		});
            },
        	error: function(){
        		location.href = 'index.html?#/login';
            }}); 
	});
} ]);