import React, { useState } from "react";
import Login from "./screens/Login";
import SignUp from "./screens/SignUp";
import ForgotPassword from "./screens/ForgotPassword";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("login");

  const renderPage = () => {
    switch (currentPage) {
      case "login":
        return <Login navigate={setCurrentPage} />;
      case "signup":
        return <SignUp navigate={setCurrentPage} />;
      case "forgotPassword":
        return <ForgotPassword navigate={setCurrentPage} />;
      default:
        return <Login navigate={setCurrentPage} />;
    }
  };

  return <div className="app-container">{renderPage()}</div>;
}

export default App;
