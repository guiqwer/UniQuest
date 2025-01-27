import React from "react";

function SignUp({ navigate }) {
  return (
    <div className="container">
      <h2>Dados para Cadastro</h2>
      <p>Crie uma conta na UniQuest</p>
      <form>
        <div className="form-group">
          <input type="text" placeholder="Nome Completo*" required />
        </div>
        <div className="form-group">
          <input type="email" placeholder="Email*" required />
        </div>
        <div className="form-group">
          <input type="password" placeholder="Senha*" required />
        </div>
        <div className="form-group">
          <input type="password" placeholder="Confirmar Senha*" required />
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
