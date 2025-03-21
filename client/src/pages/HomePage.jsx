import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Dashboard from "../components/Dashboard";
import quizStore from "../store/quizStore";

function Homepage() {
  const [classes, setClasses] = useState([]);

  // console.log("userData", userData);

  return (
    <div className="w-full max-h-[100vh] flex flex-col items-end">
      <div className="w-[77%]">
        <div className="p-6 flex flex-col gap-6">
          <Header/>
          <Dashboard classes={classes}/>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
