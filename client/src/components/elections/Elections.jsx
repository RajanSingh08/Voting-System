import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { FaChartSimple } from "react-icons/fa6";
import "./style.scss";
import { FaRankingStar } from "react-icons/fa6";
import Header from "../../components/header/Header";

const Elections = ({ data }) => {
  const [elections, setElections] = useState(data);

  console.log(data)

  //set running elections here
  const navigate = useNavigate();

  return (
    <div className="container">
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
          return (
            <li key={item._id}>
              <h1>{item.title}</h1>
              <p>{item.description}</p>
              <div className="col">
                <span>Organisation:</span>
                <p>{item.organisation}</p>
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
                onClick={() => {
                  if (status === "Completed") {
                    navigate(`/election/results/${item._id}`);
                  } else {
                    navigate(`/election/${item._id}`);
                  }
                }}
                type="button"
              >
                {status === "Completed" && (
                  <>
                    <p>Results</p>
                    <FaRankingStar />
                  </>
                )}
                {(status === "Upcoming" || status === "Ongoing") &&
                  "View Details"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Elections;
