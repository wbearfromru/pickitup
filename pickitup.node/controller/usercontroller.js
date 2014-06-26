// users.js

var UserHandling = require('../handling/userhandling');
var GameHandling = require('../handling/gamehandling');
var async = require('async');
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');

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
	UserHandling.getByEmail(req.body.username, function(err, user) {
		if (err)
			return next(err);

		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		if (user == null || user.password != req.body.password) {
			res.send(401, 'Wrong user or password');
			return;
		}

		var profile = {
			first_name : user.firstname,
			last_name : user.lastname,
			uniqueId : user.uniqueId
		};
		// We are sending the profile inside the token
		var token = jwt.sign(profile, 'LFKJLKSDFOIAJU1098179', {
			expiresInMinutes : 60 * 5
		});
		
		res.json({
			token : token
		});

	});
};

exports.login_fb = function(req, res, next) {
	console.log('fb_id ' + req.body.fb_id);
	UserHandling.getByFbId(
		req.body.fb_id,
		function (err, user) {
			if (err)
				return next(err);
			
			res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

			var profile = {
				first_name : user.firstname,
				last_name : user.lastname,
				uniqueId : user.uniqueId
			};
			// We are sending the profile inside the token
			var token = jwt.sign(profile, 'LFKJLKSDFOIAJU1098179', {
				expiresInMinutes : 60 * 5
			});
			
			res.json({
				token : token
			});
	    });
	
};

exports.logout = function(req, res, next) {
	req.session = null;
	res.redirect('/');
};

exports.me = function(req, res, next) {
	var userUniqueId = req.user.uniqueId;
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
      res.json({
			player: {
				screenName : user.screenName,
				dateOfBirth : user.dateOfBirth,
				email : user.email,
				description : user.description,
				uniqueId : user.uniqueId
			},
			games: games,
			schedule: schedule
	  });
  });
};

exports.show_user = function(req, res, next) {
	var userUniqueId = req.param('uniqueId');
      //Load user to get userId first
	UserHandling.getByUniqueId(userUniqueId, function(err, user) {
		if (err)
			return next(err);
		
		// Here locals will be populated with 'user' and 'posts'
		res.json({
			player: {
				screenName : user.screenName,
				dateOfBirth : user.dateOfBirth,
				description : user.description,
				uniqueId : user.uniqueId
			},
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
				var profile = {
					first_name : user.firstname,
					last_name : user.lastname,
					uniqueId : user.uniqueId
				};
				// We are sending the profile inside the token
				var token = jwt.sign(profile, 'LFKJLKSDFOIAJU1098179', {
					expiresInMinutes : 60 * 5
				});
				
				res.json({
					token : token
				});
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
					var profile = {
						first_name : user.firstname,
						last_name : user.lastname,
						uniqueId : user.uniqueId
					};
					// We are sending the profile inside the token
					var token = jwt.sign(profile, 'LFKJLKSDFOIAJU1098179', {
						expiresInMinutes : 60 * 5
					});
					
					res.json({
						token : token
					});
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