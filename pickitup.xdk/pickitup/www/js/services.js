'use strict';

/* Services */
var phonecatServices = angular.module('phonecatServices', ['ngResource']);

phonecatServices.factory('Phone', ['$resource',
  function($resource){
    return $resource('phones/:phoneId.json', {}, {
      query: {method:'GET', params:{phoneId:'phones'}, isArray:true}
    });
  }]);

phonecatServices.factory('AuthService', ['$http', '$window', 'Session', function ($http, $window, Session) {
  return {
    login: function (credentials) {
      return $http.jsonp('http://localhost:3000/login', {
          params: {
              callback: 'JSON_CALLBACK',
              format:'json',
              username: credentials.username,
              password: credentials.password
          }
      });
    },
    logout: function(){
    	delete $window.sessionStorage.isAuthenticated;
    },
    isAuthenticated: function () {
      return $window.sessionStorage.isAuthenticated;
    },
    isAuthorized: function (authorizedRoles) {
      if (!angular.isArray(authorizedRoles)) {
         authorizedRoles = [authorizedRoles];
      }
      return (this.isAuthenticated() && authorizedRoles.indexOf(Session.userRole) !== -1);
    }
  };
} ]);

phonecatServices.service('Session', function() {
	this.create = function(sessionId, userId, userRole) {
		this.id = sessionId;
		this.userId = userId;
		this.userRole = userRole;
	};
	this.destroy = function() {
		this.id = null;
		this.userId = null;
		this.userRole = null;
	};
	return this;
})
