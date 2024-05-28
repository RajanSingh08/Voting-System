import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { RiCloseLine } from "react-icons/ri";
import { IoIosAddCircleOutline } from "react-icons/io";
import Header from "../../components/header/Header";
import dayjs from "dayjs";
import "./style.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const CommunityHome = () => {


  const [elections, setElections] = useState([]);

  const fetchElections = async () => {
      await axios.get("http://localhost:6001/elections").then((res) => {

          if (localStorage.getItem("role")==="Voter") {

            setElections(res.data.filter(election => (election.organization === localStorage.getItem("organization") && new Date(election.start) <= new Date() && new Date(election.end) >= new Date())));

          }else if (localStorage.getItem("role")==="Community" ) {

            setElections(res.data.filter(election => (election.organization === localStorage.getItem("username") && new Date(election.start) <= new Date() && new Date(election.end) >= new Date())));

          }
          else{
            setElections(res.data.filter(election => new Date(election.start) <= new Date() && new Date(election.end) >= new Date()));
          }
      }
      );
  }


  useEffect(() => {
      fetchElections();
  }, []);




  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start: "",
    end: "",
    organization: localStorage.getItem("username"),
    organizationId:  localStorage.getItem("userId"),
  });

  const [showForm, setShowForm] = useState(false);
  useEffect(() => {
    //fetch all elections data
  }, []);
  const navigate = useNavigate();
  const formValidation = () => {
    const { title, description, start, end } = formData;
    if (!title) {
      toast.error("Title is required!", { duration: 1000 });
      return false;
    } else if (!description) {
      toast.error("Description is required", { duration: 1000 });
      return false;
    } else if (!start) {
      toast.error("Start date is required", { duration: 1000 });
      return false;
    } else if (!end) {
      toast.error("End date is required", { duration: 1000 });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formValidation()) {
      const date1 = new Date(formData.start);
      const date2 = new Date(formData.end);
      const currentDate = new Date();

      if (date1 >= date2 || currentDate > date1) {
        toast.error("Improper Schedule!", { duration: 1000 });
        return false;
      }

      //submit the form

      await axios.post("http://localhost:6001/create-election", formData).then((res) => {
        if (res.data) {
          toast.success("Election created successfully!", { duration: 1000 });
          setShowForm(false);
        }
      }
      );

    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Header />
      <div className="community">
      {
        localStorage.getItem("role")==="Voter" ?
          <h2>
             Ongoing <span>Elections ({localStorage.getItem("organization")})</span>
          </h2>
        :
          <h2>
            Ongoing <span>Elections</span>
          </h2>
      }

      {!showForm && localStorage.getItem("role")==="Community" && (
          <div className="add" onClick={() => setShowForm(true)} >
            <IoIosAddCircleOutline  />
            <h4 className="">Create new election</h4>
          </div>
        )}
        {showForm && (
          <div className="modal">
            <RiCloseLine onClick={() => setShowForm(false)} />
            <form onSubmit={handleSubmit}>
              <div className="inputContainer">
                <label htmlFor="name">Election Name</label>
                <input
                  onChange={handleChange}
                  value={formData.title}
                  name="title"
                  id="name"
                  type="text"
                />
              </div>
              <div className="inputContainer">
                <label htmlFor="description">Description</label>
                <input
                  onChange={handleChange}
                  value={formData.description}
                  name="description"
                  id="description"
                  type="text"
                />
              </div>
              <div className="inputContainer">
                <label htmlFor="start">Start</label>
                <input
                  onChange={handleChange}
                  value={formData.start}
                  name="start"
                  id="start"
                  type="datetime-local"
                />
              </div>
              <div className="inputContainer">
                <label htmlFor="end">End</label>
                <input
                  onChange={handleChange}
                  value={formData.end}
                  name="end"
                  id="end"
                  type="datetime-local"
                />
              </div>

              <button type="submit">Submit</button>
            </form>
          </div>
        )}

        <Toaster position="top-center" reverseOrder={false} />
          {elections.length === 0 && <p style={{textAlign: "center"}} >No ongoing elections</p>}
 
        <ul className="elections">
          {elections.map((item) => {
              const date1 = new Date(item?.start);
              const date2 = new Date(item?.end);
              const date = new Date();
              let status;
    
              if (date >= date2) {
                status = "Completed";
              } else if (date >= date1 && date < date2) {
                status = "Ongoing";
              } else {
                status = "Upcoming";
              }
            return(
            <li key={item._id}>
              <h1>{item.title}</h1>
              <p>{item.description}</p>
              <div className="col">
                <span>Organisation:</span>
                <p>{item.organization}</p>
              </div>
              <div className="col">
                <span>Status:</span>
                <p>{status}</p>
              </div>
              <div className="row">
                <div className="col">
                  <span>Start date:</span>
                  <p>{dayjs(item.start).format("MMM D, YYYY")}</p>
                </div>
                <div className="col">
                  <span>End date:</span>
                  <p>{dayjs(item.end).format("MMM D, YYYY")}</p>
                </div>
              </div>
              <button
                onClick={() => navigate(`/election/${item._id}`)}
                type="button"
              >
                View
              </button>
            </li>
          )})}
        </ul>
        
      </div>
      
    </>
  );
};

export default CommunityHome;
