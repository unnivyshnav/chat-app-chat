import "./conversations.css";
import vector from "../ellipse.svg";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Conversations({ conversation, currentUser }) {
  const [user, setUser] = useState([]);
  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id);

    const getUser = async () => {
      try {
        const res = await axios(
          "http://localhost:5000/auth?userId=" + friendId
        );

        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  });
  return (
    <div className="conversation">
      <img src={vector} className="conversationImg" alt="" />
      <div className="userDetails">
        <div className="username">
          <span className="conversationName">{user.name}</span>
        </div>
        <div className="number">{user.mobile}</div>
      </div>
    </div>
  );
}
