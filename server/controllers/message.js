const Message = require('../models/message');
const User = require("../models/user");

module.exports.getMessage = async (req, res) => {
    try {
        // Fetch the list of messages from the database
        const messageList = await Message.find()
            .sort({ _id: -1 }) 
            .limit(100);      

        // Reverse the order of messages to have the most recent ones first
        const reversedMessageList = messageList.reverse();

        // Send the response back to the client
        res.send({ success: true, msgs: reversedMessageList });
    } catch (error) {
        res.status(500).send({ success: false, error: 'An error occurred while fetching messages.' });
    }
};

