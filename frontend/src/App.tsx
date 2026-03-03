import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./pages/ProtectedRoute";
import PublicRoute from "./pages/PublicRoute";
//import ProtectedRoute from "./pages/ProtectedRoute";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        // bublic routes
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />


        {/* <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> */}

        {/* <Route path="/protected" element={<ProtectedRoute />} /> */}
        

          <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;




