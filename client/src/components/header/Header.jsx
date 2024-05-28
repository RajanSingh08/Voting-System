import React, { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { BiHome } from "react-icons/bi";
import { IoPeopleOutline } from "react-icons/io5";
import { MdHowToVote } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import "./style.scss";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [menu, setMenu] = useState(false);
  const [theme, setTheme] = useState('light');
  const navigate = useNavigate();

  const logout = async () =>{
    
    localStorage.clear();
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        localStorage.removeItem(key);
      }
    }
    
    navigate('/');
  }

  return (
    <div className="header">
      <div className="logo">VotingSystem</div>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} >Mode</button>
      <ul className="menuOptions">
        <li onClick={() => navigate("/home")} >Home</li>
        <li onClick={() => navigate("/allElections")}>Elections</li>
        {localStorage.getItem("role") !== "Voter" 
        && <li onClick={() => navigate("/voters")}>Voters</li>
        }
        {localStorage.getItem("role") === "Admin" 
        && <li onClick={() => navigate("/organizations")}>Organizations</li>
        }
        <li onClick={logout} >Logout</li>
      </ul>
      <button onClick={() => setMenu(!menu)} type="button">
        <RxHamburgerMenu />
      </button>

      {menu && (
        <ul className="menu">
          <li>
            <BiHome />
          </li>
          <li>
            <MdHowToVote onClick={() => navigate("/community/elections")} />
          </li>
          <li>
            <IoPeopleOutline onClick={() => navigate("/community/people")} />
          </li>
          <li>
            <CgProfile />
          </li>
        </ul>
      )}
    </div>
  );
};

export default Header;
