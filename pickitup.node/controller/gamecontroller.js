// users.js
// Routes to CRUD users.

var Game = require('../model/game');
var Location = require('../model/location');
var moment = require('moment');

/**
 * GET /users
 */
exports.create = function(req, res, next) {
	var userAuthenticated = (req.session.isLoggedIn == true);
	res.render('creategame', {
		title : 'title',
		userAuthenticated : userAuthenticated
	});
};

exports.create_proceed = function(req, res, next) {

	// Build objects from request
	var gameData = {
			title : req.body.title,
			startDate : req.body.startDate,
			duration : req.body.duration,
			description : req.body.description,
			uniqueId : Math.random().toString(36).substr(2, 10)
	};
	
	var locationData = {
			lat : parseFloat(req.body.lat),
			lng : parseFloat(req.body.lng),
			uniqueId : Math.random().toString(36).substr(2, 10)
	};

	// Validate posted data
	var hasErrors = false;
	var errors = {};
	
	// empty title is not allowed
	if (isEmpty(gameData.title)){
		hasErrors = true;
		errors.title = true;
	}
	
	// startDate is required
	if (isEmpty(req.body.startDate)){
		hasErrors = true;
		errors.startDate = true;
	}

	// Data is not valid, return user to his form
	if (hasErrors){
		var userAuthenticated = (req.session.isLoggedIn == true);
		res.render('creategame', {
			title : 'title',
			userAuthenticated : userAuthenticated,
			game: gameData,
			location: locationData,
			errors: errors
		});
		return;
	} 
	
	// If everything is ok let's store the game
	var userUniqueId = req.session.userUniqueId;
	gameData.startDate = moment(req.body.startDate,'DD/MM/YYYY HH:mm').format('YYYYMMDDHHmmss');
	Game.create_on_location(
		userUniqueId,
		gameData,
		locationData, 
		function(err, game) {
			if (err)
				return next(err);
			res.redirect('/');
		}
	);

};

exports.list_games = function(req, res, next) {
	var userUniqueId = req.session.userUniqueId;
	var data = req.query;
	Game.list(
		parseFloat(data.fromX),
		parseFloat(data.toX),
 		parseFloat(data.fromY), 
 		parseFloat(data.toY),
		data.ts, 
		userUniqueId,
		function(err, games) {
		if (err)
			return next(err);
		res.send(games);
	});
};

exports.count_games = function(req, res, next) {
	var userUniqueId = req.session.userUniqueId;
	var data = req.query;
	Game.count(
			parseFloat(data.fromX),
			parseFloat(data.toX),
			parseFloat(data.fromY), 
			parseFloat(data.toY),
			userUniqueId,
			function(err, games) {
				if (err)
					return next(err);
				res.send(games);
			});
};

exports.list_created = function(req, res, next) {
	var userUniqueId = req.session.userUniqueId;
	Game.list_created(
		userUniqueId,
		function(err, games) {
			if (err)
				return next(err);
			res.send(games);
		}
	);
};
exports.join_game = function(req, res, next) {
	var userUniqueId = req.session.userUniqueId;
	var gameUniqueId = req.param('uniqueId');
	Game.join(
		userUniqueId,
		gameUniqueId,
		function(err, games) {
			if (err) return next(err);
			res.send(true);
		}
	);
};
exports.leave_game = function(req, res, next) {
	var userUniqueId = req.session.userUniqueId;
	var gameUniqueId = req.param('uniqueId');
	Game.leave(
			userUniqueId,
			gameUniqueId,
			function(err, games) {
				if (err) return next(err);
				res.send(true);
			}
	);
};

function isEmpty(str) {
	return (typeof str == 'undefined' || str.length == 0);
}