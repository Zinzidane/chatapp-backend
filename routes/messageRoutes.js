const express = require('express');
const router = express.Router();

const MessageCtrl = require('../controllers/message');
const AuthHelper = require('../helpers/AuthHelper');

router.post('/chat-messages/:senderId/:receiverId', AuthHelper.VerifyToken, MessageCtrl.SendMessage);

module.exports = router;