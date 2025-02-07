import React, { useState } from "react";
import Login from "./screens/Login";
import SignUp from "./screens/SignUp";
import ForgotPassword from "./screens/ForgotPassword";
import NavBar from "./screens/NavBar";
import Feed from "./screens/Feed";
import PinInput from "./screens/ResetCode";
import Profile from "./screens/components/Profile";
import Proof
 from "./screens/UploadProof";
const App = () => {
  const [screen, setScreen] = useState("navbar");

  const navigate = (page) => {
    setScreen(page);
  };

  return (
    <>
      {screen === "login" && <Login navigate={navigate} />}
      {screen === "forgotPassword" && <ForgotPassword navigate={navigate} />}
      {screen === "signup" && <SignUp navigate={navigate} />}
      {screen === "feed" && (
        <>
          <NavBar navigate={navigate} />
          <Feed />
        </>
      )}
      {screen === "navbar" && <NavBar navigate={navigate} />}
      {screen === "resetCode" && <PinInput navigate={navigate} />}
      {screen === "proof" && <Proof navigate={navigate} />}
      {screen === "interactions" && (
    <>
        <NavBar navigate={navigate} />
        <ProfileInteractions navigate={navigate} /> {/* Adicione a prop navigate */}
    </>
)}

{screen === "profile" && (
    <>
        <NavBar navigate={navigate} />
        <Profile navigate={navigate} /> {/* Adicione a prop navigate */}
    </>
)}
    </>
  );
};

export default App;