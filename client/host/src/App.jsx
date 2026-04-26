import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Landingpage from "./components/Landingpage";
import Homepage from "./components/Homepage";
import Register from "./components/Register";
import Login from "./components/Login";
import { selectAuthToken } from "./store/authSlice";

const RequireAuth = ({ children }) => {
  const token = useSelector(selectAuthToken);
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Landingpage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/home"
        element={
          <RequireAuth>
            <Homepage />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
