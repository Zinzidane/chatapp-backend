const express = require('express');
const router = express.Router();

const ImageCtrl = require('../controllers/images');
const AuthHelper = require('../helpers/AuthHelper');

router.post('/upload-image', AuthHelper.VerifyToken, FriendCtrl.UploadImage);

module.exports = router;