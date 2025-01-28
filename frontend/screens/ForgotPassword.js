import React from "react";

function ForgotPassword({ navigate }) {
  return (
    <div className="container">
      <h2>Recuperação de Senha</h2>
      <p>Insira seu email para redefinir sua senha.</p>
      <form>
        <div className="form-group">
          <input type="email" placeholder="Email*" required />
        </div>
        <button type="submit" className="btn-login">
          Enviar
        </button>
      </form>
      <div className="form-actions">
        <a onClick={() => navigate("login")} href="#">
          Voltar para o login
        </a>
      </div>
    </div>
  );
}

export default ForgotPassword;
