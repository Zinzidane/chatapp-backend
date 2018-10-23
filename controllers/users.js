const HttpStatus = require('http-status-codes');
const moment = require('moment');

const User = require('../models/userModels');

module.exports = {
  async GetAllUsers(req, res) {
    await User.find({})
      .populate('posts.postId')
      .populate('following.userFollowed')
      .populate('followers.follower')
      .populate('chatList.receiverId')
      .populate('chatList.msgId')
      .populate('notifications.senderId')
      .then(result => {
        res.status(HttpStatus.OK).json({message: 'All users', result});
      })
      .catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
      });
  },
  async GetUser(req, res) {
    await User.findOne({_id: req.params.id})
      .populate('posts.postId')
      .populate('following.userFollowed')
      .populate('followers.follower')
      .populate('chatList.receiverId')
      .populate('chatList.msgId')
      .populate('notifications.senderId')
      .then(result=> {
        res.status(HttpStatus.OK).json({message: 'User by id', result});
      })
      .catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
      });
  },
  async GetUserByName(req, res) {
    await User.findOne({username: req.params.username})
      .populate('posts.postId')
      .populate('following.userFollowed')
      .populate('followers.follower')
      .populate('chatList.receiverId')
      .populate('chatList.msgId')
      .populate('notifications.senderId')
      .then(result=> {
        res.status(HttpStatus.OK).json({message: 'User by name', result});
      })
      .catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
      });
  },
  async ProfileView(req, res) {
    const dateValue = moment().format('YYYY-MM-DD');
    await User.update({
      _id: req.body.id,
      'notifications.date': {$ne: dateValue}
    }, {
      $push: {
        notifications: {
          senderId: req.user._id,
          message: `${req.user.username} viewed your profile`,
          created: new Date(),
          date: dateValue
        }
      }
    });
  }
};
