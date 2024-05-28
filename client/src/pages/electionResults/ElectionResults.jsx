import React, { useEffect, useState } from "react";
import "./style.scss";
import { v4 } from "uuid";
import Header from "../../components/header/Header";
import { useParams } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import axios from "axios";

const candidates = [
  { id: "candidate1", name: "Candidate A" },
  { id: "candidate2", name: "Candidate B" },
  { id: "candidate3", name: "Candidate C" },
];

const votes = [
  { candidateId: "candidate1", voters: ["voter1", "voter2", "voter3"] },
  { candidateId: "candidate2", voters: ["voter4", "voter5"] },
  {
    candidateId: "candidate3",
    voters: ["voter6", "voter7", "voter8", "voter9"],
  },
];
 
const ElectionResults = () => {
  const [contestants, setContestants] = useState([]);
  const [loading, setLoading] = useState(true);
  const { electionId } = useParams();

  const fetchElectionDetails = async () => {
    await axios.get(`http://localhost:6001/contestants/${electionId}`).then((res) => {
      setContestants(res.data);
      setLoading(false);
    });
  };
  useEffect(() => {
    fetchElectionDetails();
  }, []);


  const sorted = contestants.sort(
    (a, b) => b.votesCount - a.votesCount
  );

  return (
    <>
      <Header />
      {loading ? (
        <div className="loadingContainer">
          <Loader />
        </div>
      ) : (
        <div className="results">
          <h1>Election Results</h1>
          <ul className="resultsContainer">
            {sorted?.map((c, i) => {
              return (
                <li key={v4()}>
                  <span>{i + 1}:</span>
                  <p>{c.contestantName} (userId: {c.userId})</p>
                  {"-"}
                  <p>
                    <span>{c.votesCount} </span>Votes
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
};

export default ElectionResults;
