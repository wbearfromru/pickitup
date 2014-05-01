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

