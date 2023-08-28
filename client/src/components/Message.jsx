// Importing necessary dependencies and styles
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import "../styles/message.css";

// Defining the Message component
export default function Message(props) {
  // Initializing style objects to be used later
  let styles = {};
  let s = {};
  let bs = {};
  let ds = {};

  // Using the useCookies hook to access cookies
  const [cookies, setCookies] = useCookies();

  // State to store fetched link data
  const [linkData, setLinkData] = useState(null);

  // Creating a DOMParser instance to parse HTML
  var parser = new DOMParser();

  // useEffect hook to fetch data when component mounts
  useEffect(() => {
    async function fetchData() {
      // Fetching link data if the message has a link
      if (props.msgObj.link) {
        let res = await axios.get("http://localhost:4000/fetch-data", {
          params: {
            url: props.msgObj.link,
          },
        });

        // Scrolling to the bottom
        props.scroll();

        // Extracting data and truncating description if necessary
        res = res.data;
        if (res.description.length > 120)
          res.description = res.description.substr(0, 120) + "...";

        // Updating the linkData state
        setLinkData(res);
      }
    }

    // Calling the fetchData function
    fetchData();
  }, []);

  // Checking if the message user matches the logged-in user
  if (cookies.userData.mail === props.msgObj.usermail) {
    styles = {
      marginLeft: "auto", // Aligning the message to the right
    };
    s = {
      backgroundColor: "aliceblue",
      borderRadius: "10px",
      borderTopRightRadius: "0",
    };
    bs = {
      borderColor: "aliceblue",
      backgroundColor: "white",
    };
  }

  return (
    <div style={styles} className="msgCont">
      {/* Displaying user info if the previous message is from a different user */}
      {props.prev !== props.msgObj.username && (
        <div className="userInfo">
          <div className="userTitle">
            {props.msgObj.username.toUpperCase().charAt(0)}
          </div>
          <p>{props.msgObj.username}</p>
          <p className="msgTime">
            {/* Formatting and displaying the message timestamp */}
            {new Date(props.msgObj.time).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      )}

      {/* Displaying the message content */}
      {props.msgObj.msg && (
        <div
          className="msgContent"
          style={s}
          dangerouslySetInnerHTML={{
            // Rendering parsed HTML content
            __html: parser.parseFromString(props.msgObj.msg, "text/html").body.innerHTML,
          }}
        ></div>
      )}
    </div>
  );
}
