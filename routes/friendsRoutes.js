const express = require('express');
const router = express.Router();

const FriendCtrl = require('../controllers/friends');
const AuthHelper = require('../helpers/AuthHelper');

router.post('/follow-user', AuthHelper.VerifyToken, FriendCtrl.FollowUser);
router.post('/unfollow-user', AuthHelper.VerifyToken, FriendCtrl.UnfollowUser);

module.exports = router;