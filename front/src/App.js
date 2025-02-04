import React, { useState } from "react";
import Login from "./screens/Login";
import SignUp from "./screens/SignUp";
import ForgotPassword from "./screens/ForgotPassword";
import NavBar from "./screens/NavBar";
import PinInput from "./screens/ResetCode";

const App = () => {
  const [screen, setScreen] = useState("login");

  const navigate = (page) => {
    setScreen(page);
  };

  return (
    <>
      {screen === "login" && <Login navigate={navigate} />}
      {screen === "forgotPassword" && <ForgotPassword navigate={navigate} />}
      {screen === "signup" && <SignUp navigate={navigate} />}
      {screen === "navbar" && <NavBar navigate={navigate} />}
      {screen === "resetCode" && <PinInput navigate={navigate} />}
    </>
  );
};

export default App;