
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