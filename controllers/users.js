const HttpStatus = require('http-status-codes');

const User = require('../models/userModels');

module.exports = {
  async GetAllUsers(req, res) {
    await User.find({})
      .populate('posts.postId')
      .populate('following.userFollowed')
      .populate('followers.follower')
      .then(result => res.status(HttpStatus.OK).json({message: 'All users', result}))
      .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'}));
  },
  async GetUser(req, res) {
    await User.findOne({_id: req.params.id})
      .populate('posts.postId')
      .populate('following.userFollowed')
      .populate('followers.follower')
      .then(result=> res.status(HttpStatus.OK).json({message: 'User by id', result}))
      .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'}));
  },
  async GetUserByName(req, res) {
    await User.findOne({username: req.params.username})
      .populate('posts.postId')
      .populate('following.userFollowed')
      .populate('followers.follower')
      .then(result=> res.status(HttpStatus.OK).json({message: 'User by name', result}))
      .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'}));
  }
};
