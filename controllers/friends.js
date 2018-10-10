const HttpStatus = require('http-status-codes');

const User = require('../models/userModels');

module.exports = {
  FollowUser(req, res) {
    const followUser = async () => {
      await User.update({
          _id: req.user._id,
          // To prevent follow a user more than one time
          "following.userFollowed": {$ne: req.body.userFollowed}
        }, {
          $push: {
            following: {
              userFollowed: req.body.userFollowed
            }
          }
      });

      await User.update({
          _id: req.user.userFollowed,
          // To prevent follow a user more than one time
          "following.follower": {$ne: req.body._id}
        }, {
          $push: {
            followers: {
              follower: req.body._id
            }
          }
      });
    };

    followUser()
      .then(() => {
        res.status(HttpStatus.OK).json({message: 'Following user now'})
      })
      .catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'})
      });
  }
};
