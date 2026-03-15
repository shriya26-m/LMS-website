// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
// import Navbar from '../components/Navbar';
//import Courses from "./Courses";
import StudentDashboard from "../components/StudentDashboard";
import InstructorDashboard from "../components/InstructorDashboard";


export default function Dashboard() {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<"student" | "instructor">("student");

  useEffect(() => {
    if (user?.role) {
      setUserRole(user.role as "student" | "instructor");
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Navbar userRole={userRole} /> */}
      
      <div className="">
        {userRole === "student" ? (
          <StudentDashboard />
        ) : (
          <InstructorDashboard />
        )}
      
      </div>
    </div>
  );
}
