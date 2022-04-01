import "./chat.css";
import vector from "../vector.svg";
import Conversations from "../components/Conversations";
import ChatHeader from "../components/chatHeader/ChatHeader";
import Message from "../components/message/Message";
import { useContext, useState, useEffect, useRef } from "react";
import { Context } from "../context/Context";
import axios from "axios";
import { io } from "socket.io-client";

export default function Chat() {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef(null);
  const { user } = useContext(Context);
  const scrollRef = useRef();

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", user._id);
    socket.current.on("getUsers", (users) => {
      setOnlineUsers(
        user.followings.filter((f) => users.some((u) => u.userId === f))
      );
    });
  }, [user]);
  console.log(onlineUsers);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/conversations/" + user._id
        );
        setConversations(res.data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user._id]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/messages/" + currentChat?._id
        );
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });

    try {
      const res = await axios.post(
        "http://localhost:5000/api/messages",
        message
      );
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  console.log(messages);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div>
      <div className="messenger">
        <div className="rectangle">
          <span className="vector">
            <img src={vector} alt="" />
          </span>
          <span className="auth">Chatly</span>
          <div className="activeHead">Active Users</div>
          <div className="users">
            {conversations.map((c) => (
              <div onClick={() => setCurrentChat(c)}>
                <Conversations conversation={c} currentUser={user} />
              </div>
            ))}
          </div>
        </div>

        {!currentChat ? (
          <div>
            {" "}
            <span className="register">Please Select a user to Message</span>
            <div>
              <span className="choose">
                Choose one from your existing messages, or start a new one
              </span>
            </div>
          </div>
        ) : (
          <div className="chatWrapper">
            <div className="chatTop">
              <ChatHeader />
            </div>
            <div className="chatMessages">
              {messages.map((m) => (
                <div ref={scrollRef}>
                  <Message message={m} own={m.sender === user._id} />
                </div>
              ))}
            </div>
            <div className="chatBottom">
              <textarea
                name=""
                id=""
                placeholder="Start a new message"
                className="chatMessageInput"
                onChange={(e) => setNewMessage(e.target.value)}
                value={newMessage}
              ></textarea>
              <button className="sendButton" onClick={handleSubmit}>
                Send
              </button>
            </div>
          </div>
        )}
      </div>{" "}
    </div>
  );
}
