import React, { useEffect, useState } from "react";
import "./style.scss";
import { CgProfile } from "react-icons/cg";
import Header from "../../components/header/Header";
import Loader from "../../components/loader/Loader";
import { v4 } from "uuid";
import axios from "axios";


const CommunityPeople = () => {
  const [organizationPeople, setOrganizationPeople] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUserCommunityPeople = async () => {
    await axios.get("http://localhost:6001/users").then((res) => {
        if(localStorage.getItem("role") === "Admin"){
            setOrganizationPeople(res.data)
        } else if (localStorage.getItem("role") === "Community"){
            setOrganizationPeople(res.data.filter(user => user.organization === localStorage.getItem("username")))
        }
    });
    setLoading(false);
  };

  useEffect(() => {
    getUserCommunityPeople();
  }, []);

  return (
    <>
      <Header />
      {loading ? (
        <div className="loadingContainer">
          <Loader />
        </div>
      ) : (
        <div className="people">
          <h1> Voters List</h1>

          {
            organizationPeople.length === 0 && <p>No voters available</p>
          }
          <ul className="usersContainer">
            {organizationPeople?.map((i) => {
              return (
                <li key={v4()}>
                  
                  <CgProfile />
                  <div>
                    <h4>{i.username}</h4>
                    <span>
                      <b>govtId:</b>
                      <p>{i.govtId}</p>
                    </span>
                    <span>
                      <b>User Id:</b>
                      <p>{i.userId}</p>
                    </span>
                    <span>
                      <b>Organization:</b>
                      <p>{i.organization}</p>
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
};

export default CommunityPeople;
