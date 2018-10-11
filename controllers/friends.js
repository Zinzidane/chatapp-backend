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
            },
            notifications: {
              senderId: req.user._id,
              message: `${req.user.username} is now following you`
            }
          }
      });
    };

    followUser()
      .then(() => {
        res.status(HttpStatus.OK).json({message: 'Following user now'});
      })
      .catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
      });
  },
  UnfollowUser(req, res) {
    const unfollowUser = async () => {
      await User.update({
          _id: req.user._id
        }, {
          $pull: {
            following: {
              userFollowed: req.body.userFollowed
            }
          }
      });

      await User.update({
          _id: req.user.userFollowed
        }, {
          $pull: {
            followers: {
              follower: req.body._id
            }
          }
      });
    };

    unfollowUser()
      .then(() => {
        res.status(HttpStatus.OK).json({message: 'Unfollowing user now'});
      })
      .catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
      });
  },
  async MarkNotification(req, res) {
    if(!req.body.deleteValue) {
      await User.updateOne({
          _id: req.user._id,
          'notifications._id': req.params.id
        }, {
          $set: {
            'notifications.$.read': true
          }
        }
      ).then(() => {
        res.status(HttpStatus.OK).json({message: 'Marked as read'});
      }).catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
      });
    } else {
      await User.update({
          _id: req.user._id,
          'notifications._id': req.params.id
        }, {
          $pull: {
            notifications: {
              _id: req.params.id
            }
          }
        }
      ).then(() => {
        res.status(HttpStatus.OK).json({message: 'Deleted successfully'});
      }).catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
      });
    }
  },
  async MarkAllNotifications(req, res) {
    await User.update({
        _id: req.user._id
      }, {
        $set: {
          'notifications.$[elem].read': true
        }
      },
      {
        arrayFilters: [
          {'elem.read': false}
        ],
        multi: true
      }
    ).then(() => {
      res.status(HttpStatus.OK).json({message: 'Marked all successfully'});
    }).catch(err => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
    });
  }
};
