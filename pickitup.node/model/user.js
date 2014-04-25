var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://localhost:7474');

// private constructor:

var User = module.exports = function User(_node) {
    // all we'll really store is the node; the rest of our properties will be
    // derivable or just pass-through properties (see below).
    this._node = _node;
}

// public instance properties:

Object.defineProperty(User.prototype, 'id', {
    get: function () { return this._node.id; }
});
Object.defineProperty(User.prototype, 'screenName', {
	get: function () { return this._node.data['firstname'] + ' ' + this._node.data['lastname']; }
});

Object.defineProperty(User.prototype, 'firstname', {
    get: function () {
        return this._node.data['firstname'];
    },
    set: function (firstname) {
        this._node.data['firstname'] = firstname;
    }
});
Object.defineProperty(User.prototype, 'lastname', {
	get: function () {
		return this._node.data['lastname'];
	},
	set: function (lastname) {
		this._node.data['lastname'] = lastname;
	}
});
Object.defineProperty(User.prototype, 'dateOfBirth', {
	get: function () {
		return this._node.data['dateOfBirth'];
	},
	set: function (dateOfBirth) {
		this._node.data['dateOfBirth'] = dateOfBirth;
	}
});
Object.defineProperty(User.prototype, 'email', {
	get: function () {
		return this._node.data['email'];
	},
	set: function (email) {
		this._node.data['email'] = email;
	}
});
Object.defineProperty(User.prototype, 'password', {
	get: function () {
		return this._node.data['password'];
	},
	set: function (password) {
		this._node.data['password'] = password;
	}
});
Object.defineProperty(User.prototype, 'uniqueId', {
	get: function () {
		return this._node.data['uniqueId'];
	},
	set: function (uniqueId) {
		this._node.data['uniqueId'] = uniqueId;
	}
});
Object.defineProperty(User.prototype, 'picture', {
	get: function () {
		return this._node.data['picture'];
	},
	set: function (picture) {
		this._node.data['picture'] = picture;
	}
});
Object.defineProperty(User.prototype, 'description', {
	get: function () {
		return this._node.data['description'];
	},
	set: function (description) {
		this._node.data['description'] = description;
	}
});

// public instance methods:

User.prototype.save = function (callback) {
    this._node.save(function (err) {
        callback(err);
    });
};

User.prototype.del = function (callback) {
    // use a Cypher query to delete both this user and his/her following
    // relationships in one transaction and one network request:
    // (note that this'll still fail if there are any relationships attached
    // of any other types, which is good because we don't expect any.)
    var query = [
        'MATCH (user:Player)',
        'WHERE ID(user) = {userId}',
        'DELETE user',
        'WITH user',
        'MATCH (user) -[rel:follows]- (other)',
        'DELETE rel',
    ].join('\n')

    var params = {
        userId: this.id
    };

    db.query(query, params, function (err) {
        callback(err);
    });
};

User.prototype.follow = function (other, callback) {
    this._node.createRelationshipTo(other._node, 'follows', {}, function (err, rel) {
        callback(err);
    });
};

User.prototype.unfollow = function (other, callback) {
    var query = [
        'MATCH (user:Player) -[rel:follows]-> (other:Player)',
        'WHERE ID(user) = {userId} AND ID(other) = {otherId}',
        'DELETE rel',
    ].join('\n')

    var params = {
        userId: this.id,
        otherId: other.id,
    };

    db.query(query, params, function (err) {
        callback(err);
    });
};

// calls callback w/ (err, following, others) where following is an array of
// users this user follows, and others is all other users minus him/herself.
User.prototype.getFollowingAndOthers = function (callback) {
    // query all users and whether we follow each one or not:
    var query = [
        'MATCH (user:Player), (other:Player)',
        'OPTIONAL MATCH (user) -[rel:follows]-> (other)',
        'WHERE ID(user) = {userId}',
        'RETURN other, COUNT(rel)', // COUNT(rel) is a hack for 1 or 0
    ].join('\n')

    var params = {
        userId: this.id,
    };

    var user = this;
    db.query(query, params, function (err, results) {
        if (err) return callback(err);

        var following = [];
        var others = [];

        for (var i = 0; i < results.length; i++) {
            var other = new User(results[i]['other']);
            var follows = results[i]['COUNT(rel)'];

            if (user.id === other.id) {
                continue;
            } else if (follows) {
                following.push(other);
            } else {
                others.push(other);
            }
        }

        callback(null, following, others);
    });
};

// static methods:

User.get = function (id, callback) {
    db.getNodeById(id, function (err, node) {
        if (err) return callback(err);
        callback(null, new User(node));
    });
};

User.getAll = function (callback) {
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

User.getByEmail = function (email, callback) {
    var query = [
        'MATCH (user:Player {email: {email}})',
        'RETURN user',
    ].join('\n');

    var params = {
		email : email
	};

    db.query(query, params, function (err, results) {
        if (err) return callback(err);
        //FIXME What if there is none?
        callback(null, new User(results[0]['user']));
    });
};

User.getByUniqueId = function (uniqueId, callback) {
    var query = [
        'MATCH (user:Player {uniqueId: {uniqueId}})',
        'RETURN user',
    ].join('\n');

    var params = {
		uniqueId : uniqueId
	};

    db.query(query, params, function (err, results) {
        if (err) return callback(err);
        //FIXME What if there is none?
        callback(null, new User(results[0]['user']));
    });
};

User.getByGameId = function(gameUniqueId, callback) {
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
             return new User(result['user']);
         });
         callback(null, users);
     });
};

// creates the user and persists (saves) it to the db, incl. indexing it:
User.create = function (data, callback) {
    // construct a new instance of our class with the data, so it can
    // validate and extend it, etc., if we choose to do that in the future:
    var node = db.createNode(data);
    var user = new User(node);

    // but we do the actual persisting with a Cypher query, so we can also
    // apply a label at the same time. (the save() method doesn't support
    // that, since it uses Neo4j's REST API, which doesn't support that.)
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