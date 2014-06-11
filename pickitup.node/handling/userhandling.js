var User = require('../model/user');
var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://localhost:7474');

// static methods:

exports.get = function (id, callback) {
    db.getNodeById(id, function (err, node) {
        if (err) return callback(err);
        callback(null, new User(node));
    });
};

exports.getAll = function (callback) {
    var query = [
        'MATCH (user:Player)',
        'RETURN user',
    ].join('\n');
   
    db.query(query, null, function (err, results) {
        if (err) return callback(err);
        var users = results.map(function (result) {
            return new User(result['user']);
        });
        callback(null, users);
    });
};

exports.getByEmail = function (email, callback) {
    getByProperty('email', email, callback);
};

exports.getByUniqueId = function (uniqueId, callback) {
    getByProperty('uniqueId', uniqueId, callback);
};
exports.getByFbId = function (fbId, callback) {
	getByProperty('fb_id', fbId, callback);
};

function getByProperty(property, value, callback) {
	var query = [
	             'MATCH (user:Player {' + property + ': {value}})',
	             'RETURN user',
	             ].join('\n');
	
	var params = {
			value: value
	};
	
	db.query(query, params, function (err, results) {
		if (err) return callback(err);
		try {
			var user = null;
			if (results.length > 0){
				user = new User(results[0]['user']);
			}
			callback(null, user);
		} catch (ex) {
			callback(ex, null);
		}
	});
};

exports.getByGameId = function(gameUniqueId, callback) {
	var query = [
	             'match (user: Player)-[r:playes]->(game: Game {uniqueId : {uniqueId}})',
	             'return user'
	         ].join('\n');

     var params = {
		 uniqueId: gameUniqueId
     };
     
     db.query(query, params, function (err, results) {
         if (err) return callback(err);
         var users = results.map(function (result) {
        	 var user = new User(result['user']);
             return {uniqueId: user.uniqueId, screenName: user.screenName};
         });
         callback(null, users);
     });
};

// creates the user and persists (saves) it to the db, incl. indexing it:
exports.create = function (data, callback) {
    var query = [
        'CREATE (user:Player {data})',
        'RETURN user',
    ].join('\n');

    data.uniqueId = Math.random().toString(36).substr(2, 10);
    var params = {
        data: data
    };

    db.query(query, params, function (err, results) {
        if (err) return callback(err);
        var user = new User(results[0]['user']);
        callback(null, user);
    });
};
