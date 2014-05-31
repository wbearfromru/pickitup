var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://localhost:7474');

// static methods:

exports.getByUniqueId = function (uniqueId, callback) {
    getByProperty('uniqueId', uniqueId, callback);
};

function getByProperty(property, value, callback) {
	var query = [
	             'MATCH (location:Location {' + property + ': {value}})',
	             'RETURN location',
	             ].join('\n');
	
	var params = {
			value: value
	};
	
	db.query(query, params, function (err, results) {
		if (err) return callback(err);
		try {
			var location = null;
			if (results.length > 0){
				var result = results[0]['location'].data;
				location = {
					lat: result.lat,
					lng: result.lng,
					title: result.title,
				};
			}
			callback(null, location);
		} catch (ex) {
			callback(ex, null);
		}
	});
};

exports.listInArea = function (fromX,toX,fromY,toY, callback) {
    var query = [
        'match (location:Location)',
        'where location.lng > {fromX} and location.lng < {toX} and location.lat > {fromY} and location.lat < {toY}',
		'return location',
    ].join('\n');

    var params = {
    		fromX: fromX,
    		toX: toX,
    		fromY: fromY,
    		toY: toY,
    };
    
    db.query(query, params, function (err, results) {
        if (err) return callback(err);
        var locations = results.map(function (row) {
        	var result = row['location'].data;
        	
            return {
            	lat: result.lat,
				lng: result.lng,
				title: result.title,
            };
        });
        callback(null, locations);
    });
};
