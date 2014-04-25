var express = require('express');
var router = express.Router();
var usercontroller = require('../controller/usercontroller');
var gamecontroller = require('../controller/gamecontroller');
var moment = require('moment');

/* GET home page. */
router.get('/', usercontroller.index);

router.get('/login', usercontroller.login);
router.post('/login', usercontroller.login_proceed);

router.get('/logout', usercontroller.logout);

router.get('/me', usercontroller.me);

router.get('/signup', usercontroller.signup);
router.post('/signup', usercontroller.signup_proceed);

router.get('/creategame', gamecontroller.create);
router.post('/creategame', gamecontroller.create_proceed);


router.get('/nearme', usercontroller.nearme);
router.post('/nearme/join/:uniqueId*', gamecontroller.join_game);
router.post('/nearme/leave/:uniqueId*', gamecontroller.leave_game);

router.get('/created', gamecontroller.list_created);

router.get('/game/:uniqueId*', gamecontroller.show_game);

router.get('/list', gamecontroller.list_games);
router.get('/count', gamecontroller.count_games);

router.get('/upload/test', function(req, res, next){
	res.render('basic', {
	});
});

module.exports = router;
