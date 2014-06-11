var express = require('express');
var router = express.Router();
var usercontroller = require('../controller/usercontroller');
var gamecontroller = require('../controller/gamecontroller');
var moment = require('moment');

/*router.get('/login', usercontroller.login);*/
router.post('/login', usercontroller.login_proceed);
router.post('/login_fb', usercontroller.login_fb);

router.get('/logout', usercontroller.logout);

router.get('/api/me', usercontroller.me);

router.get('/signup', usercontroller.signup);
router.post('/signup', usercontroller.signup_proceed);
router.post('/signup_fb', usercontroller.signup_fb_proceed);

router.post('/api/creategame', gamecontroller.create_proceed);


router.get('/api/nearme', usercontroller.nearme);
router.post('/api/nearme/join/:uniqueId*', gamecontroller.join_game);
router.post('/api/nearme/leave/:uniqueId*', gamecontroller.leave_game);

router.get('/api/created', gamecontroller.list_created);

router.get('/api/game/:uniqueId*', gamecontroller.show_game);

router.get('/api/player/:uniqueId*', usercontroller.show_user);

router.get('/api/list', gamecontroller.list_games);
router.get('/api/count', gamecontroller.count_games);

router.get('/api/test', gamecontroller.user_schedule);

module.exports = router;
