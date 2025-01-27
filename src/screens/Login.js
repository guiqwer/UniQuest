import React from "react";
import "../App.css";

const Login = ({ navigate }) => {
  return (
    <div className="container">
      <h2>UniQuest</h2>
      <p>Acesse sua conta</p>
      <form>
        <div className="form-group">
          <input type="text" placeholder="Email*" required />
        </div>
        <div className="form-group">
          <input type="password" placeholder="Senha*" required />
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
