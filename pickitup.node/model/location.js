var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://localhost:7474');

// private constructor:

var Location = module.exports = function Location(_node) {
    // all we'll really store is the node; the rest of our properties will be
    // derivable or just pass-through properties (see below).
    this._node = _node;
}

// public instance properties:

Object.defineProperty(Location.prototype, 'id', {
    get: function () { return this._node.id; }
});

Object.defineProperty(Location.prototype, 'name', {
    get: function () {
        return this._node.data['name'];
    },
    set: function (name) {
        this._node.data['name'] = name;
    }
});

Location.create = function (data, callback) {
    // construct a new instance of our class with the data, so it can
    // validate and extend it, etc., if we choose to do that in the future:

    // but we do the actual persisting with a Cypher query, so we can also
    // apply a label at the same time. (the save() method doesn't support
    // that, since it uses Neo4j's REST API, which doesn't support that.)
    var query = [
        'CREATE (location:Location {data})',
        'RETURN location',
    ].join('\n');

    var params = {
        data: data
    };

    db.query(query, params, function (err, results) {
        if (err) return callback(err);
        var location = new Location(results[0]['location']);
        callback(null, location);
    });
};