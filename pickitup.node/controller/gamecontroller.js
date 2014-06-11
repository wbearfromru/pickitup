// users.js
// Routes to CRUD users.

var GameHandling = require('../handling/gamehandling');
var UserHandling = require('../handling/userhandling');
var moment = require('moment');
var async = require('async');

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
		res.statusCode = 400;
		res.json(errors);
		return;
	} 
	
	// If everything is ok let's store the game
	var userUniqueId = req.user.uniqueId;
	gameData.startDate = moment(req.body.startDate,'DD/MM/YYYY HH:mm').format('YYYYMMDDHHmmss');
	GameHandling.createOnLocation(
		userUniqueId,
		gameData,
		locationData, 
		function(err, game) {
			if (err)
				return next(err);
			res.statusCode = 200;
			res.json('ok');
		}
	);

};

exports.show_game = function(req, res, next) {
	var gameUniqueId = req.param('uniqueId');
	
	async.series({
		game: function(callback){
			GameHandling.getByUniqueId(gameUniqueId, callback);
	    },
	    players: function(callback){
	    	UserHandling.getByGameId(gameUniqueId,callback);
	    },
	},
	function(err, results) {
		if (err)
			return next(err);
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.json({
			game: results.game,
			players: results.players,
		});
	}
	);
};

exports.list_games = function(req, res, next) {
	var data = req.query;
	var userUniqueId = req.user.uniqueId;
	GameHandling.listInArea(
		parseFloat(data.fromX),
		parseFloat(data.toX),
 		parseFloat(data.fromY), 
 		parseFloat(data.toY),
		data.ts, 
		userUniqueId,
		function(err, games) {
		if (err)
			return next(err);
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.jsonp(games);
	});
};

exports.count_games = function(req, res, next) {
	var userUniqueId = req.user.uniqueId;
	var data = req.query;
	GameHandling.countInArea(
			parseFloat(data.fromX),
			parseFloat(data.toX),
			parseFloat(data.fromY), 
			parseFloat(data.toY),
			userUniqueId,
			function(err, games) {
				if (err)
					return next(err);
				res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
				res.send(games);
			});
};

exports.list_created = function(req, res, next) {
	var userUniqueId = req.session.userUniqueId;
	GameHandling.listByUser(
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
	GameHandling.joinGame(
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
	GameHandling.leaveGame(
			userUniqueId,
			gameUniqueId,
			function(err, games) {
				if (err) return next(err);
				res.send(true);
			}
	);
};


exports.user_schedule = function(req, res, next) {
	var userUniqueId = req.session.userUniqueId;
	GameHandling.userSchedule(
			userUniqueId,
			function(err, games) {
				if (err) return next(err);
				res.send(games);
			}
	);
};

function isEmpty(str) {
	return (typeof str == 'undefined' || str.length == 0);
}