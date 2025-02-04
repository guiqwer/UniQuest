import React, { useState } from "react";
import "../App.css";
import axiosInstance from "../axios"

const Login = ({ navigate }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      const token = response.data.token;
      if (token) {
        sessionStorage.setItem("token", token);
        axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;
        console.log("Salvo no sessionStorage", sessionStorage.getItem("token"))
        navigate("home");
      }
    } catch(error){
      setError("Email ou senha inválidos");
      console.error("Erro no login:", error.response);
    }
  };
  
  return (
    <div className="container">
      <h2>UniQuest</h2>
      <p>Acesse sua conta</p>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <input type="text" placeholder="Email*" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <input type="password" placeholder="Senha*" required value={password} onChange={(e) => setPassword(e.target.value)}/>
        </div>
        <button type="submit" className="btn-login">
          Entrar
        </button>
      </form>
      <div className="forgot-password">
        <a
          href="#"
          onClick={() => navigate("forgotPassword")}>
          Esqueci minha senha
        </a>
      </div>
      <div className="signup">
        <p>
          Ainda não tem conta?{" "}
          <a href="#" onClick={() => navigate("signup")}> 
            Faça o cadastro
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
