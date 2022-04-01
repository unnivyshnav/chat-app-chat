import "./chatHeader.css";
import vector from "../../ellipse.svg";

export default function ChatHeader() {
  return (
    <div className="chatHeader">
      <div className="headerWrapper">
        <div className="ellipse">
          {" "}
          <img src={vector} alt="" />
        </div>
        <div className="userDetails">
          <div className="username">
            <span className="conversationName">Vyshnav</span>
          </div>
          <div className="number">9898989898</div>
        </div>
      </div>
    </div>
  );
}
