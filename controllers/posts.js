const Joi = require('joi');
const HttpStatus = require('http-status-codes');

const Post = require('../models/postModels');
const User = require('../models/userModels');

module.exports = {
  AddPost(req, res) {
    const schema = Joi.object().keys({
      username: Joi.string().required()
    });

    const {error} = Joi.validate(req.body, schema);

    if(error & error.details) {
      return res.status(HttpStatus.BAD_REQUEST).json({msg: error.details});
    }

    const body = {
      user: req.user._id,
      username: req.user.username,
      post: req.body.post,
      created: new Date()
    };
    
    Post.create(body).then(async (post) => {
      // Updating post in posts array in database for this user
      await User.update({
        _id: req.user._id
      }, {
        $push: {posts: {
          postId: post._id,
          post: req.body.post,
          created: new Date()
        }}
      });
      res.status(HttpStatus.OK).json({message: 'Post created', post});
    }).catch(err => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
    });
  }
};