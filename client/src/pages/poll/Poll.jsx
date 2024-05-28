import React, { useEffect, useState } from "react";
import "./style.scss";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { v4 } from "uuid";
import Header from "../../components/header/Header";
import Timer from "../../components/timer/Timer";
import axios from "axios";


const Poll = () => {
  const [vote, setVote] = useState("");
  const [electionDetails, setElectionDetails] = useState([]);
  const { electionId } = useParams();
  const navigate = useNavigate();

  const fetchElectionDetails = async () => {
    await axios.get(`http://localhost:6001/election/${electionId}`).then((res) => {
      setElectionDetails(res.data);
    });
  };
  useEffect(() => {
    fetchElectionDetails();
  }, []);

  const handleVote = async () => {
    await axios.post(`http://localhost:6001/vote`, {

      electionId: electionId,
      candidateId: vote,
      voterId: localStorage.getItem("userId"),

    }).then((res) => {
      toast.success("Voted Successfully", { duration: 1000 });
      setVote("");
      
    }).catch((err) => {
      toast.error("Something went wrong!", { duration: 1000 });
    });
    setTimeout(() => {
      navigate("/home", { replace: true });
    }, 1000);
    
  };

  return (
    <>
      <Header />
      <div className="container">
        <div className="pollContainer">
          <h1> Voting panel</h1>

          {electionDetails.candidates ?
                <ul className="candidates">
                {electionDetails.candidates.map((c, i) => {
                  return (
                    <li className="candidate" key={v4()}>
                      <div className="row">
                        <input
                          onChange={(e) => {
                            setVote(e.target.value);
                          }}
                          checked={vote === c.id}
                          name="candidate"
                          value={c.id}
                          type="radio"
                        />
                        <h4>{c.name}</h4>
                      </div>
    
                      <div className="row">
                        <p>userId: {c.userId}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>

          :<>
          <h2>Loading...</h2>
          </>
          }
          
          <button
            onClick={handleVote}
            className={vote ? "vote" : "disable" + " " + "vote"}
          >
            Vote
          </button>
        </div>

        <Timer targetDate={electionDetails.end} />
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default Poll;
