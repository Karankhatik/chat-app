require("dotenv").config();
const exp = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const db = require('./config/mongoose');
const app = exp();
app.use(exp.urlencoded({extended: true}));
app.use(exp.json());
const server = require('http').createServer(app);
const Message = require('./models/message');
const socketIo = require('socket.io');
const io = socketIo(server);


const corsOptions = {
    origin: "*",
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
  };
// Allow requests from specific origins
app.use(cors(corsOptions));

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

server.listen(process.env.PORT, () => {
    console.log("Server is listening on port " + process.env.PORT);
});