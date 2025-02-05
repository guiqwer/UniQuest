import React, { useState } from "react";
import Login from "./screens/Login";
import SignUp from "./screens/SignUp";
import ForgotPassword from "./screens/ForgotPassword";
import NavBar from "./screens/NavBar";
import PinInput from "./screens/ResetCode";
import Profile from "./screens/Profile";
import Proof
 from "./screens/UploadProof";
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
      {screen === "profile" && <Profile navigate={navigate} />}
      {screen === "proof" && <Proof navigate={navigate} />}
    </>
  );
};

export default App;