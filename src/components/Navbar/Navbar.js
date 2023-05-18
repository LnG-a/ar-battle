import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { signOut } from "firebase/auth";
import { auth } from "../../Firebase/Firebase";

function Navbar() {
  const [click, setClick] = useState(false);
  const navigate = useNavigate();
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("sign out successful");
        navigate("/login");
      })
      .catch((error) => console.log(error));
  };

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
          <button onClick={userSignOut} type="button" className="logout-button">
            Đăng xuất
          </button>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
