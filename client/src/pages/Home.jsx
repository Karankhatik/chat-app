import { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import Message from "../components/Message";
import "../styles/home.css";

export default function Home() {
  const [cookies, setCookies, removeCookies] = useCookies();
  const [msgs, setMsgs] = useState([]);
  const [chat, setChat] = useState("");
  const scrollDiv = useRef(null);
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [emojDiv, setEmojDiv] = useState(false);
  const [users, setUsers] = useState([]);

  // Check user authentication and fetch messages & users on initial load
  useEffect(() => {
    if (!cookies.token) navigate("/login");

    // Fetch messages
    axios.get("https://chat-app-fsm6.onrender.com/api/message/get-messages", {
      headers: {
        Authorization: `Basic ${cookies.token}`,
      },
    })
    .then((res) => {
      const data = res.data;
      setMsgs(data.msgs);
    });

    // Fetch users
    axios.get("https://chat-app-fsm6.onrender.com/api/user/get-users")
    .then((res) => {
      const data = res.data;
      setUsers(data);
    });

    // Initialize socket connection
    setSocket(io("https://chat-app-fsm6.onrender.com"));
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Listen for new messages from the socket
    socket.on("new_msg", (msgObj) => {
      setMsgs((prev) => [...prev, msgObj]);
    });
  }, [socket]);

  useEffect(() => {
    // Scroll to the bottom of the message list when new messages arrive
    if (scrollDiv.current)
      scrollDiv.current.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  async function sendMsg() {
    if (chat === "") return;

    // Prepare message object
    const msgObj = {
      date: new Date(),
      text: chat,
    };

    // Emit the message through the socket
    socket.emit("msg", cookies.token, msgObj);

    // Clear chat input and close emoji picker
    setChat("");
    setEmojDiv(false);
  }

  function scroll() {
    if (scrollDiv.current)
      scrollDiv.current.scrollIntoView({ behavior: "smooth" });
  }

  function emojiClick(emObj, evt) {
    setChat((prev) => prev + emObj.emoji);
  }

  function logout() {
    // Logout user and navigate to login page
    removeCookies("token");
    navigate("/login");
  }

  return (
    <>
      <div className="msgContainer">
        <h1>
          Live Chat <i className="fi fi-sr-sign-out-alt" onClick={logout}></i>
        </h1>
        <div className="msgList">
          {/* Display each message using the Message component */}
          {msgs.map((msg, ind) => {
            let prev = "";
            if (ind !== 0) prev = msgs[ind - 1].username;
            return (
              <Message msgObj={msg} prev={prev} key={msg._id} scroll={scroll} />
            );
          })}
          <div className="dummy" ref={scrollDiv}></div>
        </div>
        <div className="sendDiv">
          <textarea
            className="chatText"
            placeholder="Message..."
            value={chat}
            onChange={(evt) => setChat(evt.target.value)}
          ></textarea>
          <div className="lowerDiv">
            <div>
              {/* Toggle emoji picker */}
              <i
                className="fi fi-rr-smile"
                onClick={() => setEmojDiv((prev) => !prev)}
              ></i>
            </div>
          </div>
          {/* Send message */}
          <i className="fi fi-ss-paper-plane-top" onClick={sendMsg}></i>
        </div>
      </div>
      {/* Display emoji picker if active */}
      {emojDiv && <EmojiPicker onEmojiClick={emojiClick} />}
    </>
  );
}
