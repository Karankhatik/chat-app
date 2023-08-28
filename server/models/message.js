const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    username: String,
    usermail: String,
    msg: String,
    time: Date,

});

module.exports = mongoose.model("Message", messageSchema);

