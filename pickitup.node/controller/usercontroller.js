// users.js

var UserHandling = require('../handling/userhandling');
var GameHandling = require('../handling/gamehandling');
var async = require('async');

exports.index = function(req, res, next) {
	var userAuthenticated = (req.session.isLoggedIn == true);
	res.render('index', {
		userAuthenticated : userAuthenticated
	});
};

exports.login = function(req, res, next) {
	var userAuthenticated = (req.session.isLoggedIn == true);
	res.render('login', {
		userAuthenticated : userAuthenticated
	});
};

exports.login_proceed = function(req, res, next) {
	UserHandling.getByEmail(
		req.body.username,
		function (err, user) {
	        if (err) return next(err);
	        if (user != null && user.password == req.body.password){
	        	req.session.isLoggedIn = true;
	        	req.session.userUniqueId = user.uniqueId;
	        	res.redirect('/nearme');
	        } else {
	        	req.session.isLoggedIn = false;
	        	res.render('login', {
	        		userAuthenticated : false,
	        		username: req.body.username,
	        		hasErrors: true
	        	});
	        }
	    });
};
exports.login_fb = function(req, res, next) {
	UserHandling.getByFbId(
		req.body.fb_id,
		function (err, user) {
	        if (err) return next(err);
	        console.log('user: ' + JSON.stringify(user));
	        if (typeof user.uniqueId != 'undefined'){
	        	req.session.isLoggedIn = true;
				req.session.fbLoggedIn = true;
	        	req.session.userUniqueId = user.uniqueId;
	        	res.send({redirect: '/nearme'});
	        } else {
	        	req.session.isLoggedIn = false;
	        	res.render('login', {
	        		userAuthenticated : false,
	        		username: req.body.username,
	        		hasErrors: true
	        	});
	        }
	    });
	
};

exports.logout = function(req, res, next) {
	req.session = null;
	res.redirect('/');
};

exports.me = function(req, res, next) {
	var userUniqueId = req.session.userUniqueId;
	var userAuthenticated = (req.session.isLoggedIn == true);
	var user = null;
	var games = null;
	var schedule = null;
	async.series([
      //Load user to get userId first
      function (callback){
    	  UserHandling.getByUniqueId(
			userUniqueId,
			function (err, foundUser) {
				if (err) return callback(err);
				user = foundUser;
				callback();
			}
		);
      },
      function(callback) {
    	  GameHandling.listByUser(userUniqueId,
  	        	function(err, foundGames){
    		  		if (err) return callback(err);
    		  		games = foundGames;
    		  		callback();
  	        	}
  	      );
      },
      function(callback) {
			GameHandling.userSchedule(
				userUniqueId,
				function(err, games) {
					if (err) return next(err);
					schedule = games;
					callback();
				}
			);
      },
  ], function(err) { 
      if (err) return next(err);
      //Here locals will be populated with 'user' and 'posts'
      res.render('me', {
			player: user,
			games: games,
			schedule: schedule,
			userAuthenticated : userAuthenticated
	  });
  });
};

exports.show_user = function(req, res, next) {
	var userUniqueId = req.param('uniqueId');
	var userAuthenticated = (req.session.isLoggedIn == true);
      //Load user to get userId first
	UserHandling.getByUniqueId(userUniqueId, function(err, foundUser) {
		if (err)
			return next(err);
		
		// Here locals will be populated with 'user' and 'posts'
		res.render('player', {
			player : foundUser,
			userAuthenticated : userAuthenticated
		});
	});
};

exports.signup = function(req, res, next) {
	res.render('signup', {
	});
};

exports.signup_proceed = function(req, res, next) {
	var errors = {};
	var hasErrors = false;
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var email = req.body.email;
	var password = req.body.password;
	var description = req.body.description;
	var playerSex = req.body.playerSex;
	var dateOfBirth = req.body.dateOfBirth;
	var picture = req.body.picture;
	
	if (isEmpty(firstname)){
		errors.firstname = true;
		hasErrors = true;
	}
	if (isEmpty(firstname)){
		errors.firstname = true;
		hasErrors = true;
	}
	if (isEmpty(lastname)){
		errors.lastname = true;
		hasErrors = true;
	}
	if (isEmpty(email)){
		errors.email = true;
		hasErrors = true;
	}
	if (isEmpty(password)){
		errors.password = true;
		hasErrors = true;
	}
	
	var data = {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
        description: description,
        playerSex: playerSex,
        dateOfBirth: dateOfBirth,
        picture: picture
    };
	if (hasErrors){
		res.render('signup', {
    		userAuthenticated : false,
    		data: data,
    		errors: errors,
    		hasErrors: true
    	});
	} else {
		UserHandling.create(
			data, 
			function (err, user) {
		        if (err) return next(err);
		        res.redirect('/');
			}
		);
	}
};
exports.signup_fb_proceed = function(req, res, next) {
	var hasErrors = false;
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var email = req.body.email;
	var fb_id = req.body.fb_id;
	var description = req.body.description;
	var playerSex = req.body.playerSex;
	var dateOfBirth = req.body.dateOfBirth;
	var picture = req.body.picture;
	
	var data = {
			firstname: firstname,
			lastname: lastname,
			email: email,
			fb_id: fb_id,
			description: description,
			playerSex: playerSex,
			dateOfBirth: dateOfBirth,
			picture: picture
	};
	if (hasErrors){
		res.render('/', {
			userAuthenticated : false,
		});
	} else {
		UserHandling.create(
				data, 
				function (err, user) {
					if (err) return next(err);
					req.session.isLoggedIn = true;
					req.session.fbLoggedIn = true;
		        	req.session.userUniqueId = user.uniqueId;
		        	res.send({redirect: '/nearme'});
				}
		);
	}
};

exports.nearme = function(req, res, next) {
	var userAuthenticated = (req.session.isLoggedIn == true);
	res.render('nearme', {
		userAuthenticated : userAuthenticated
	});
};

function isEmpty(str) {
	return (typeof str == 'undefined' || str.length == 0);
}