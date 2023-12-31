require("dotenv").config();
const exp = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const db = require('./config/mongoose');
const app = exp();
app.use(exp.urlencoded({extended: true}));
app.use(exp.json());
app.use(cors());
const server = require('http').createServer(app);
const Message = require('./models/message');
const io = require('socket.io')(server,{
    cors:{
        origin: 'http://localhost:3000',
        credentials: true,
        methods: ["GET","POST"]
    }
});

io.on("connection", socket => {
    socket.on("msg", (token, msgObj) => {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err,user) => {
            if(err) return;

            user = user._doc;
            const newMsg = new Message({
                username: user.username,
                usermail: user.mail,
                msg: msgObj.text,
                time: msgObj.date,
                
            });
            newMsg.save();
            io.emit("new_msg", newMsg);
        })
    })
})

// use express router
app.use('/api', require('./routes'));

server.listen(4000, () => {
    console.log("Server is listening on port 4000");
});