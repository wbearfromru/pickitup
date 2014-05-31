var LocationHandling = require('../handling/locationhandling');

exports.show_location = function(req, res, next) {
	var locationUniqueId = req.param('uniqueId');
	var userAuthenticated = (req.session.isLoggedIn == true);
      //Load user to get userId first
	LocationHandling.getByUniqueId(locationUniqueId, function(err, foundLocation) {
		if (err)
			return next(err);
		
		res.render('location', {
			location : foundLocation,
			userAuthenticated : userAuthenticated
		});
	});
};

exports.list_locations = function(req, res, next) {
	var data = req.query;
	LocationHandling.listInArea(
		parseFloat(data.fromX),
		parseFloat(data.toX),
 		parseFloat(data.fromY), 
 		parseFloat(data.toY),
		function(err, games) {
			if (err)
				return next(err);
			res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
			res.send(games);
		}
	);
};

function isEmpty(str) {
	return (typeof str == 'undefined' || str.length == 0);
}