const HttpStatus = require('http-status-codes');

const User = require('../models/userModels');

module.exports = {
  async GetAllUsers(req, res) {
    await User.find({})
      .populate('posts.postId')
      .then(users => res.status(HttpStatus.OK).json({message: 'All users', users}))
      .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'}));
  }
};