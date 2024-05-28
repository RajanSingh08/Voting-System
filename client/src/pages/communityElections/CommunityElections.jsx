import React, { useEffect, useState } from "react";
import Elections from "../../components/elections/Elections";
import Header from "../../components/header/Header";
import "./style.scss";
import axios from "axios";


const CommunityElections = () => {

  const [elections, setElections] = useState([]);

  const fetchElections = async () => {
      await axios.get("http://localhost:6001/elections").then((res) => {

          if (localStorage.getItem("role")==="Voter") {

            setElections(res.data.filter(election => (election.organization === localStorage.getItem("organization"))));

          }else if (localStorage.getItem("role")==="Community" ) {

            setElections(res.data.filter(election => (election.organization === localStorage.getItem("username"))));

          }
          else{
            setElections(res.data);
          }
      }
      );
  }


  useEffect(() => {
      fetchElections();
  }, []);

  return (
    <div className="communityElections">
      <Header />
      <h2>
        All <span>Elections</span>
      </h2>
      {elections.length === 0 ? <p style={{textAlign: 'center'}}>No elections available</p>
      :
      <Elections data={elections} />
      }
    </div>
  );
};

export default CommunityElections;
