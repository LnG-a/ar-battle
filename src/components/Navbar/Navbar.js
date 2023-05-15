import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../Button/Button";
import "./Navbar.css";
import { signOut } from "firebase/auth";
import { auth } from "../../Firebase/Firebase";

function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("sign out successful");
      })
      .catch((error) => console.log(error));
  };

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();
  }, []);

  window.addEventListener("resize", showButton);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/home" className="navbar-logo" onClick={closeMobileMenu}>
            AR Battle
          </Link>
          <div className="menu-icon" onClick={handleClick}>
            <i className={click ? "fas fa-times" : "fas fa-bars"}></i>
          </div>
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <Link to="/home" className="nav-links" onClick={closeMobileMenu}>
                Trang chủ
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/map" className="nav-links" onClick={closeMobileMenu}>
                Bản đồ
              </Link>
            </li>
          </ul>
          {button && (
            <Button onClick={userSignOut} buttonStyle="btn--primary">
              Đăng xuất
            </Button>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
