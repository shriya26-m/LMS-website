import React from 'react';



export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <button

        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
        }}  
      >click me to Logout</button>
    </div>
  );
}   