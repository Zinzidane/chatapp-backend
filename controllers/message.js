const HttpStatus = require('http-status-codes');

const Message = require('../models/messageModels');
const Conversation = require('../models/conversationModels');
const User = require('../models/userModels');

module.exports = {
  SendMessage(req, res) {
    const { sender_Id, receiver_Id } = req.params;

    Conversation.find({
      $or: [
        {participants: {$elemMatch: {senderId: sender_Id, receiverId: receiver_Id}}},
        {participants: {$elemMatch: {senderId: sender_Id, receiverId: receiver_Id}}},
      ]
    }, async (err, result) => {
      if (result.length > 0) {

      } else {
        const newConversation = new Conversation();
        newConversation.participants.push({
          senderId: req.user._id,
          receiverId: req.params.receiver_Id
        });

        const saveConversation = await newConversation.save();

        const newMessage = new Message();

        newMessage.conversationId = saveConversation._id;
        newMessage.sender = req.user.username;
        newMessage.receiver = req.body.receiverName;
        newMessage.message.push({
          senderId: req.user._id,
          receiverId: req.params.receiver_Id,
          senderName: req.user.username,
          receiverName: req.body.receiverName,
          body: req.body.message
        });

        await newMessage
          .save()
          .then(() => res.status(HttpStatus.OK).json({message: 'Message sent'}))
          .catch(error => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'}));
      }
    });
  }
};