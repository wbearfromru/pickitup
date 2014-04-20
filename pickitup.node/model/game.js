var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://localhost:7474');
var async = require('async');
var User = require('./user');
var moment = require('moment');

// private constructor:

var Game = module.exports = function Game(_node) {
    // all we'll really store is the node; the rest of our properties will be
    // derivable or just pass-through properties (see below).
    this._node = _node;
}

// public instance properties:

Object.defineProperty(Game.prototype, 'id', {
    get: function () { return this._node.id; }
});

Object.defineProperty(Game.prototype, 'name', {
    get: function () {
        return this._node.data['name'];
    },
    set: function (name) {
        this._node.data['name'] = name;
    }
});

Game.create_on_location = function (userUniqueId, game_data, location_data, callback) {
    // but we do the actual persisting with a Cypher query, so we can also
    // apply a label at the same time. (the save() method doesn't support
    // that, since it uses Neo4j's REST API, which doesn't support that.)
    var query = [
        'MATCH (user: Player {uniqueId: {userUniqueId}})',
        'WITH user',
        'CREATE (game:Game {game_data})',
        'CREATE (location:Location {location_data})',
        'CREATE (game)-[r:appear_at]->(location), (user)-[c:created]->(game)',
        'RETURN game',
    ].join('\n');

    var params = {
    		userUniqueId: userUniqueId,
    		game_data: game_data,
    		location_data: location_data
    };

    db.query(query, params, function (err, results) {
        if (err) return callback(err);
        var game = new Game(results[0]['game']);
        callback(null, game);
    });
};

Game.list = function (fromX,toX,fromY,toY, ts,userUniqueId, callback) {
    // but we do the actual persisting with a Cypher query, so we can also
    // apply a label at the same time. (the save() method doesn't support
    // that, since it uses Neo4j's REST API, which doesn't support that.)
    var query = [
        'match (creator:Player)-[c:created]->(game: Game)-[r]->(location:Location)',
        'where location.lng > {fromX} and location.lng < {toX} and location.lat > {fromY} and location.lat < {toY}',
        'and game.startDate > {startDate} and game.startDate < {endDate}',
        'optional match (p:Player {uniqueId: {userUniqueId}})-[pl:playes]->(game)',
		'return game,location,count(p) as alreadyJoined, creator',
    ].join('\n');

    var params = {
    		fromX: fromX,
    		toX: toX,
    		fromY:fromY,
    		toY:toY,
    		userUniqueId: userUniqueId,
    		startDate: getStartDate(ts).format('YYYYMMDDHHmmss'),
    		endDate: getEndDate(ts).format('YYYYMMDDHHmmss'),
    };
    
    db.query(query, params, function (err, results) {
        if (err) return callback(err);
        var games = results.map(function (result) {
        	var game = result['game'].data;
        	var location = result['location'].data;
        	var creator = new User(result['creator']);
        	
            return {
            	name: game.title,
            	description: game.description,		
				date: moment(game.startDate,'YYYYMMDDHHmmss').format('DD/MM/YYYY hh:mm') ,
				lat: location.lat,
				lng: location.lng,
				uniqueId: game.uniqueId,
				alreadyJoined: result['alreadyJoined'] > 0,
				createdBy: creator.screenName
            };
        });
        callback(null, games);
    });
};

Game.count = function (fromX,toX,fromY,toY, userUniqueId, callback) {
    // but we do the actual persisting with a Cypher query, so we can also
    // apply a label at the same time. (the save() method doesn't support
    // that, since it uses Neo4j's REST API, which doesn't support that.)
    var query = [
        'match (location:Location)',
        'where location.lng > {fromX} and location.lng < {toX} and location.lat > {fromY} and location.lat < {toY}',
        'optional match (game0:Game)-[]->(location)',
        'where game0.startDate > {startDate0} and game0.startDate < {endDate0}',
        'optional match (game1:Game)-[]->(location)',
        'where game1.startDate > {startDate1} and game1.startDate < {endDate1}',
        'optional match (game2:Game)-[]->(location)',
        'where game2.startDate > {startDate2} and game2.startDate < {endDate2}',
        'optional match (game3:Game)-[]->(location)',
        'where game3.startDate > {startDate3} and game3.startDate < {endDate3}',
		'return count(game0) as games0, count(game1) as games1, count(game2) as games2, count(game3) as games3',
    ].join('\n');

    var params = {
    		fromX: fromX,
    		toX: toX,
    		fromY: fromY,
    		toY: toY,
    		startDate0: getStartDate('0').format('YYYYMMDDHHmmss'),
    		endDate0: getEndDate('0').format('YYYYMMDDHHmmss'),
    		startDate1: getStartDate('1').format('YYYYMMDDHHmmss'),
    		endDate1: getEndDate('1').format('YYYYMMDDHHmmss'),
    		startDate2: getStartDate('2').format('YYYYMMDDHHmmss'),
    		endDate2: getEndDate('2').format('YYYYMMDDHHmmss'),
    		startDate3: getStartDate('3').format('YYYYMMDDHHmmss'),
    		endDate3: getEndDate('3').format('YYYYMMDDHHmmss'),
    };
    
    db.query(query, params, function (err, results) {
        if (err) return callback(err);
        var games = {
				games0: results[0]['games0'],
				games1: results[0]['games1'],
				games2: results[0]['games2'],
				games3: results[0]['games3'],
            };
        callback(null, games);
    });
};

function getStartDate(type) {
	switch (type) {
	case '2':
		return moment().add('days', 1).set('hour',0).set('minute',0).set('second',0).set('millisecond',0);;
	default:
		return moment();
	}
}

function getEndDate(type) {
	switch (type) {
	case '0':
		// Next 2 hours
		return moment().add('hours',2);
	case '1':
		// end of today
		return moment().add('days', 1).startOf('day');
	case '2':
		// end of tomorrow
		return moment().add('days', 2).startOf('day');
	case '3':
		// Begin of next day
		return moment().add('week', 1).startOf('day');
	default:
		return moment();
	}
}

Game.list_created = function (userUniqueId, maincallback) {
    // but we do the actual persisting with a Cypher query, so we can also
    // apply a label at the same time. (the save() method doesn't support
    // that, since it uses Neo4j's REST API, which doesn't support that.)
    var query = [
        'match (p:Player {uniqueId: {userUniqueId}})-[c:created]->(game)',
		'return game',
    ].join('\n');

    var params = {
    		userUniqueId: userUniqueId
    };

    db.query(query, params, function (err, results) {
        if (err) return callback(err);
        var games = results.map(function (result) {
        	var game = result['game'].data;
        	
            return {
            	name: game.title,
            	description: game.description,		
				date: game.startDate,
				uniqueId: game.uniqueId
            };
        });
        async.forEach(games, function(game, callback) {
        	var query = [
	             'match (user: Player)-[r:playes]->(game: Game {uniqueId : {uniqueId}})',
	             'return user'
	         ].join('\n');

	         var params = {
        		 uniqueId: game.uniqueId
	         };
	         
	         db.query(query, params, function (err, results) {
	             if (err) return callback(err);
	             console.log(JSON.stringify(results));
	             var users = results.map(function (result) {
	                 return new User(result['user']);
	             });
	             game.players = users;
	             callback(null);
	         });
        }, function(err) {
            //Tell the user about the great success
            maincallback(err, games);
        });
        
       
    });
};

Game.join = function(userUniqueId, gameUniqueId, callback) {
	var query = [
         'match (p: Player {uniqueId: {userUniqueId}}),',
         '(g: Game {uniqueId:{gameUniqueId}})',
         'create (p)-[r:playes]->(g)',
         'return r',
     ].join('\n');

     var params = {
		 userUniqueId: userUniqueId,
		 gameUniqueId: gameUniqueId,
     };

     db.query(query, params, function (err, results) {
    	 console.log('err' + err);
         if (err) return callback(err);
         var result = results.length > 0;
         callback(null, result);
     });
}

Game.leave = function(userUniqueId, gameUniqueId, callback) {
	var query = [
         'match (p: Player {uniqueId: {userUniqueId}})-[r:playes]->',
         '(g: Game {uniqueId:{gameUniqueId}})',
         'delete r'
     ].join('\n');

     var params = {
		 userUniqueId: userUniqueId,
		 gameUniqueId: gameUniqueId,
     };

     db.query(query, params, function (err, results) {
    	 console.log('err' + err);
         if (err) return callback(err);
         callback(null, 'ok');
     });
}