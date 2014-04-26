// users.js
// Routes to CRUD users.

var User = require('../model/user');
var Game = require('../model/game');
var async = require('async');
/**
 * GET /users
 */
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
	User.getByEmail(
		req.body.username,
		function (err, user) {
	        if (err) return next(err);
	        if (user.password == req.body.password){
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
	console.log('user id: ' + req.body.fb_id);
	User.getByFbId(
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
	async.series([
      //Load user to get userId first
      function (callback){
		User.getByUniqueId(
			userUniqueId,
			function (err, foundUser) {
				if (err) return callback(err);
				user = foundUser;
				callback();
			}
		);
      },
      function(callback) {
    	  Game.list_created(userUniqueId,
  	        	function(err, foundGames){
    		  		if (err) return callback(err);
    		  		games = foundGames;
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
			userAuthenticated : userAuthenticated
	  });
  });
};

exports.signup = function(req, res, next) {
	res.render('signup', {
	});
};
exports.signup_proceed = function(req, res, next) {
	console.log(JSON.stringify(req.files));		
	
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
		User.create(
			data, 
			function (err, user) {
		        if (err) return next(err);
		        res.redirect('/');
			}
		);
	}
};
exports.signup_fb_proceed = function(req, res, next) {
	var errors = {};
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
		User.create(
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

exports.creategame = function(req, res, next) {
};

exports.nearme = function(req, res, next) {
	var userAuthenticated = (req.session.isLoggedIn == true);
	res.render('nearme', {
		userAuthenticated : userAuthenticated
	});
};



exports.create = function (req, res, next) {
    User.create({
        name: req.body['name']
    }, function (err, user) {
        if (err) return next(err);
        res.redirect('/users/' + user.id);
    });
};

/**
 * GET /users/:id
 */
exports.show = function(req, res, next) {
	User.get(req.params.id, function(err, user) {
		if (err)
			return next(err);
		// TODO also fetch and show followers? (not just follow*ing*)
		user.getFollowingAndOthers(function(err, following, others) {
			if (err)
				return next(err);
			res.render('user', {
				user : user,
				following : following,
				others : others
			});
		});
	});
};

/**
 * POST /users/:id
 */
exports.edit = function(req, res, next) {
	User.get(req.params.id, function(err, user) {
		if (err)
			return next(err);
		user.name = req.body['name'];
		user.save(function(err) {
			if (err)
				return next(err);
			res.redirect('/users/' + user.id);
		});
	});
};

/**
 * DELETE /users/:id
 */
exports.del = function(req, res, next) {
	User.get(req.params.id, function(err, user) {
		if (err)
			return next(err);
		user.del(function(err) {
			if (err)
				return next(err);
			res.redirect('/users');
		});
	});
};

/**
 * POST /users/:id/follow
 */
exports.follow = function(req, res, next) {
	User.get(req.params.id, function(err, user) {
		if (err)
			return next(err);
		User.get(req.body.user.id, function(err, other) {
			if (err)
				return next(err);
			user.follow(other, function(err) {
				if (err)
					return next(err);
				res.redirect('/users/' + user.id);
			});
		});
	});
};

/**
 * POST /users/:id/unfollow
 */
exports.unfollow = function(req, res, next) {
	User.get(req.params.id, function(err, user) {
		if (err)
			return next(err);
		User.get(req.body.user.id, function(err, other) {
			if (err)
				return next(err);
			user.unfollow(other, function(err) {
				if (err)
					return next(err);
				res.redirect('/users/' + user.id);
			});
		});
	});
};

function isEmpty(str) {
	return (typeof str == 'undefined' || str.length == 0);
}