import React, { useState } from "react";
import Login from "./screens/Login";
import SignUp from "./screens/SignUp";
import ForgotPassword from "./screens/ForgotPassword";
import NavBar from "./screens/NavBar";
import Feed from "./screens/Feed";

const App = () => {
  const [screen, setScreen] = useState("feed");

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
    </>
  );
};

export default App;