import React, { useState } from "react";
import "../App.css";
import axiosInstance from "../axios"

function SignUp({ navigate }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  
  const handleSingUp = async (event) => {
    event.preventDefault();

    if (password!==confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }
    try {
      const response = await axiosInstance.post("/register", {
        name,
        email,
        password
      });

      const token = response.data.token;
      if (token) {
        sessionStorage.setItem("token", token);
        axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;
        navigate("home");
      }
    } catch(error){
      setError("Erro ao criar uma conta. Tente novamente.");
      console.error("Erro no cadastro:", error);
    }
  };
  
  return (
    <div className="container">
      <h2>Dados para Cadastro</h2>
      <p>Crie uma conta na UniQuest</p>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSingUp}>
        <div className="form-group">
          <input type="text" placeholder="Nome Completo*" required value={name} onChange={(e) => setName(e.target.value)}/>
        </div>
        <div className="form-group">
          <input type="email" placeholder="Email*" required  value={email} onChange={(e) => setEmail(e.target.value)}/>
        </div>
        <div className="form-group">
          <input type="password" placeholder="Senha*" required value={password} onChange={(e) => setPassword(e.target.value)}/>
        </div>
        <div className="form-group">
          <input type="password" placeholder="Confirmar Senha*" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
        </div>
        <button type="submit" className="btn-login">
          Continuar
        </button>
      </form>
      <div className="form-actions">
        <p>
            Já tem usuário?{" "}
          <a onClick={() => navigate("login")} href="#">
            Faça o login
          </a>
      </p>
      </div>
    </div>
  );
}

export default SignUp;
