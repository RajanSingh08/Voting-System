import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GoCheckCircleFill } from "react-icons/go";
import Cookie from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../../components/loader/Loader";
import { FiCheck } from "react-icons/fi";
import { MdHowToVote } from "react-icons/md";
import { BsPersonRaisedHand } from "react-icons/bs";
import { IoIosClose } from "react-icons/io";
import { MdOutlineDone } from "react-icons/md";
import { LuVote } from "react-icons/lu";
import { FaChartSimple } from "react-icons/fa6";
import { LuPartyPopper } from "react-icons/lu";
import "./style.scss";
import Header from "../../components/header/Header";
import dayjs from "dayjs";
import { v4 } from "uuid";
import { FaRankingStar } from "react-icons/fa6";
import axios from "axios";



const ElectionDetails = () => {
  const [electionData, setElectionData] = useState();
  const [loading, setLoading] = useState(true);
  const { electionId } = useParams();
  const [candidates, setCandidates] = useState([]);

  const [candidateApplications, setCandidateApplications] = useState([]);



  const getCandidates = async () => {
    await axios.get(`http://localhost:6001/contestants`).then((res) => {
      setCandidateApplications(res.data.filter((i) => i.electionId === electionId && i.status === "pending"));
      setCandidates(res.data.filter((i) => i.electionId === electionId && i.status === "approved"));

    });
  };
  useEffect(() => {
    getCandidates();
  });

  const navigate = useNavigate();

  const fetchElectionDetails = async () => {
    await axios.get(`http://localhost:6001/election/${electionId}`).then((res) => {
      setElectionData(res.data);
    });
    setLoading(false);
    return;
  };
  useEffect(() => {
    fetchElectionDetails();
  }, []);


  let status;
  const date1 = new Date(electionData?.start);
  const date2 = new Date(electionData?.end);
  const date = new Date();
  if (date1 > date) {
    status = "Upcoming";
  } else if (date1 <= date && date < date2) {
    status = "Ongoing";
  } else if (date > date2) {
    status = "Completed";
  }


  const handleCandidate = async () => {
    
    await axios.post("http://localhost:6001/apply-contestant", {electionId, contestantId: localStorage.getItem("userId"), contestantName: localStorage.getItem("username"), contestantgovtId: localStorage.getItem("govtId")}).then((res) => {
      toast.success("Candidate Registered", { duration: 1000, icon: "🔥" });
      fetchElectionDetails();
    }).catch((err) => {
      toast.error("Registration failed", { duration: 1000 });
    });
    
  };

  const handleAdd = async (id) => {
    await axios.put(`http://localhost:6001/approve-contestant/${id}`).then
    ((res) => {
      toast.success("Candidate Approved", { duration: 1000, icon: "🔥" });
      fetchElectionDetails();
      getCandidates();
    }).catch((err) => {
      toast.error("Approval failed", { duration: 1000 });
    });

  };
  const handleRemove = async () => {

  };

  const sorted = candidates.sort((a, b) => b.votesCount - a.votesCount);

  return (
    <>
      <Header />
      {loading ? (
        <div className="loadingContainer">
          <Loader />
        </div>
      ) : (
        <div className="detailsContainer">
          <div className="row">
            <div className="col">
              <div className="heading">
                <h1>Election Details</h1>
              </div>
              {electionData?
              
              <div className="details">
                <h3>{electionData.title}</h3>
                <p>{electionData.description}</p>
                <div className="subDetails">
                  <span>Organisation:</span>
                  <p>{electionData.organization}</p>
                </div>
                <div className="subDetails">
                  <span>Status:</span>
                  <p>{status}</p>
                </div>

                <div className="line">
                  <div className="subDetails">
                    <span>Start date:</span>
                    <p>{dayjs(electionData.start).format("MMM D, YYYY")}</p>
                  </div>
                  <div className="subDetails">
                    <span>End date:</span>
                    <p>{dayjs(electionData.end).format("MMM D, YYYY")}</p>
                  </div>
                </div>
              </div>
              :
              <p>loding...</p>
              }


              {/* Apply as candidate */}

              {localStorage.getItem("role") === "Voter" && status === "Upcoming" && (
                <div onClick={handleCandidate} className="apply">
                  {!electionData.appliedCandidates.includes(localStorage.getItem("userId")) && (
                    <>
                      <p>Apply for candidate</p>
                      <MdHowToVote />
                    </>
                  )}

                  {electionData.candidates.includes(localStorage.getItem("userId")) && (
                    <>
                      <p>Candidate</p>
                      <div className="success">
                        <FiCheck color="white" />
                      </div>
                    </>
                  )}

                  {!electionData.candidates.includes(localStorage.getItem("userId")) && electionData.appliedCandidates.includes(localStorage.getItem("userId")) &&(
                    <>
                      <p>Applied as Candidate</p>
                      <div className="success">
                        <FiCheck color="white" />
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* View election results */}

              {status === "Completed" && (
                <div
                  onClick={() =>
                    navigate(`/election/results/${electionData._id}`)
                  }
                  className="apply"
                >
                  <p>View Results</p>
                  <FaRankingStar />
                </div>
              )}

              {/* Vote for candidate */}

              {electionData &&
              
              <>
              { status === "Ongoing" && !electionData.voters.includes(localStorage.getItem("userId")) && localStorage.getItem("role") === "Voter" && (
                <>
                  <div
                    onClick={() => navigate(`/poll/${electionData._id}`)}
                    className="apply"
                  >
                    <p>Vote</p>
                    <FaChartSimple />
                  </div>
                  <div className="msg">
                    <p>Cast your vote</p>
                    <LuVote />
                  </div>
                </>
              )}
              </>}


              {/* Already voted */}
                
              {electionData &&
              
              <>
              {status === "Ongoing" && electionData.voters.includes(localStorage.getItem("userId")) && localStorage.getItem("role") === "Voter" && (
                <>
                  <div className="apply">
                    <p>Voted</p>
                    <div className="success">
                      <FiCheck color="white" />
                    </div>
                  </div>
                  <div className="msg">
                    <p>Thanks for Voting </p>
                    <LuPartyPopper />
                  </div>
                </>
              )}
              </>}

              {/* Candidate requests */}

              {status === "Upcoming" && localStorage.getItem("role") === "Community" && (
                <div className="requests">
                  <p className="head">Candidate Requests</p>
                  <ul>
                    {candidateApplications.length === 0 && <p>No requests</p>}
                    {candidateApplications.map((i) => {
                      return (
                        <li key={i._id} className="request">
                          <p>{i.contestantName} (userId: {i.userId})</p>
                          <div>
                            <div onClick={()=> handleAdd(i._id)} className="right">
                              <MdOutlineDone />
                            </div>
                            <div onClick={()=> handleRemove(i._id)} className="wrong">
                              <IoIosClose />
                            </div>
                          </div>
                        </li>
                      );
                    })}
                    {/* render candidates with status pending */}
                  </ul>
                </div>
              )}
            </div>

            {/* Display candidates */}

            <div className="col">
              <div className="heading">
                <h1>Candidates</h1>
              </div>
              <ul className="candidates">
                {
                  electionData?.candidates.length === 0 && <p>No candidates</p>
                }
                {electionData?.candidates.map((i) => {
                  return (
                    <li className="candidate" key={v4()}>
                      <BsPersonRaisedHand />
                      <h4>{i.name}</h4>
                      <p>(userId: {i.userId})</p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Live results */}

          {status === "Ongoing" && localStorage.getItem("role") !== "Voter" && (
            <>
              <h1>Live Results</h1>
              <ul className="live">
                {sorted.map((c, i) => {
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
            </>
          )}
        </div>
      )}
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default ElectionDetails;
