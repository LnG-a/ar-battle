import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../Firebase/Firebase";
import "./Sign.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const Login = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        navigate("/home");
      })
      .catch((error) => {
        console.log(error);
        setError("Sai tên đăng nhập hoặc mật khẩu!");
      });
  };

  return (
    <div className="sign-container">
      <form className="sign-form" onSubmit={Login}>
        <h1 className="title">Đăng nhập vào tài khoản</h1>
        <p className="sign-text">Nhập tên đăng nhập</p>
        <input
          className="sign-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <p className="sign-text">Nhập mật khẩu</p>
        <input
          className="sign-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <p className="sign-error">{error}</p>
        <button className="sign-button" type="submit">
          Đăng nhập
        </button>
      </form>
    </div>
  );
};

export default Login;
