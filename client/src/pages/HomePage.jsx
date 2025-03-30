import { useState } from "react";
import Header from "../components/Header";
import Dashboard from "../components/Dashboard";
import { useAuth } from '../utils/authUtils';
import StudentDashboard from "../components/StudentDashboard";

function Homepage() {
  const { userData } = useAuth();
  const [classes, setClasses] = useState([]);

  console.log("userData", userData);

  return (
    <div className="w-full max-h-[100vh] flex flex-col items-end">
      <div className="w-full md:w-[77%]">
        <div className="p-6 flex flex-col gap-6">
          <Header/>
          {userData.isTeacher ? <Dashboard classes={classes}/> : <StudentDashboard/>}
        </div>
      </div>
    </div>
  );
}

export default Homepage;
