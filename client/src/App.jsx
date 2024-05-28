import React from "react";
import { Route, Routes } from "react-router-dom";
import Register from "./pages/signup/SignUp";
import Login from "./pages/signin/SignIn";
import Poll from "./pages/poll/Poll";
import CommunityHome from "./pages/communityHome/CommunityHome";
import CommunityElections from "./pages/communityElections/CommunityElections";
import CommunityPeople from "./pages/communityPeople/CommunityPeople";
import ElectionDetails from "./pages/electionDetails/ElectionDetails";
import ElectionResults from "./pages/electionResults/ElectionResults";
import Landing from "./pages/landing/Landing";
import Organizations  from "./pages/organizations/Organizations";

const App = () => {
  return (
    <div className="light">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        
        <Route
          path="/election/results/:electionId"
          element={<ElectionResults />}
        />


        <Route path="/home" element={<CommunityHome />} />
        <Route path="/voters" element={<CommunityPeople />} />
        <Route path="/organizations" element={<Organizations />} />
        <Route path="/allElections" element={<CommunityElections />} />

        <Route path="/election/:electionId" element={<ElectionDetails />} />
        <Route path="/poll/:electionId" element={<Poll />} />
      </Routes>
    </div>
  );
};

export default App;
