import "./home.css";
import vector from "../vector.svg";
import { useRef, useContext } from "react";
import { Context } from "../context/Context";

import axios from "axios";

export default function Home() {
  const { dispatch } = useContext(Context);
  const tokenRef = useRef();

  const handlesubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });

    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        token: tokenRef.current.value,
      });

      res.data.accessToken = tokenRef.current.value;
      console.log(res);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <form className="messenger" onSubmit={handlesubmit}>
        <div className="rectangle">
          <span className="vector">
            <img src={vector} alt="" />
          </span>
          <span className="auth">Chatly</span>
        </div>

        <span className="register">Enter Your Token</span>
        <div className="name">
          <input
            type="text"
            placeholder="Token"
            name="token"
            required="true"
            ref={tokenRef}
          />
        </div>

        <div className="nextButton">
          <button className="submitButton" type="submit">
            Login
          </button>
        </div>
      </form>{" "}
    </div>
  );
}
