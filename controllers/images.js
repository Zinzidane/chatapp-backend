const cloudinary = require('cloudinary');
const HttpStatus = require('http-status-codes');

const User = require('../models/userModels');
const keys = require('../config/secret');

cloudinary.config({ 
  cloud_name: keys.cloud_name, 
  api_key: keys.api_key, 
  api_secret: keys.api_secret
});

module.exports = {
  UploadImage(req, res) {
    cloudinary.v2.uploader.upload(req.body.image, async (error, result) => {
      await User.update({
        _id: req.user._id
      }, {
        $push: {
          images: {
            imgId: result.public_id,
            imgVersion: result.version
          }
        }
      })
      .then(() => res.status(HttpStatus.OK).json({message: 'Image uploaded successfully'}))
      .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error uploading image'}));
    });
  },
  async SetDefaultImage(req, res) {
    const {imgId, imgVersion} = req.params;

    await User.update({
      _id: req.user._id
    }, {
      picId: imgId,
      picVersion: imgVersion
    })
    .then(() => res.status(HttpStatus.OK).json({message: 'Default image set'}))
    .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'}));
  }
};