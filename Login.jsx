import React, { useState } from "react";
import "./Login.css";
import Footer from "../Components/Footer";

function Login({
                   irParaCadastro,
                   irParaHome,
                   irParaRecuperacao
               }) {

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const [erro, setErro] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {

        e.preventDefault();

        setErro("");

        if (!email || !senha) {
            setErro("Preencha todos os campos.");
            return;
        }

        setLoading(true);

        try {

            const response = await fetch(
                "http://127.0.0.1:5000/login_usuario",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        senha
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {

                // 🔥 SALVA ID
                localStorage.setItem(
                    "id_usuario",
                    data.id_usuario
                );

                // 🔥 SALVA TOKEN
                localStorage.setItem(
                    "token",
                    data.token
                );

                const emailAdmin =
                    "ana.escudeiro5@gmail.com";

                if (email === emailAdmin) {

                    localStorage.setItem(
                        "tipo",
                        "admin"
                    );

                    // 🔥 CORREÇÃO AQUI
                    irParaHome("admin", data.id_usuario);

                } else {

                    localStorage.setItem(
                        "tipo",
                        "vendedor"
                    );

                    irParaHome("vendedor", data.id_usuario);

                }

            } else {

                setErro(
                    data.erro ||
                    "Erro ao fazer login"
                );

            }

        } catch (error) {

            console.error(error);

            setErro(
                "Erro ao conectar com servidor."
            );

        }

        setLoading(false);

    };

    return (

        <div className="login-page">

            <div className="content-wrapper">

                {/* LOGO */}
                <div className="logo-container">
                    <h1 className="logo-text">
                        NanaNeném
                    </h1>
                </div>

                <div className="login-card">

                    <h2 className="login-title">
                        LOGIN
                    </h2>

                    {erro && (
                        <div className="error-message">
                            {erro}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>

                        <div className="input-group">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="Digite seu email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                            />
                        </div>

                        <div className="input-group">
                            <label>Senha</label>
                            <input
                                type="password"
                                placeholder="Digite sua senha"
                                value={senha}
                                onChange={(e) =>
                                    setSenha(e.target.value)
                                }
                            />
                        </div>

                        <button
                            className="btn-entrar"
                            disabled={loading}
                        >
                            {loading
                                ? "Entrando..."
                                : "Entrar"
                            }
                        </button>

                    </form>

                    <div className="links">

                        <button
                            type="button"
                            className="forgot-link"
                            onClick={() =>
                                irParaRecuperacao(email)
                            }
                        >
                            Esqueci minha senha
                        </button>

                        <div className="register-link">
                            Não tem conta?
                            <button
                                type="button"
                                className="link-cadastro"
                                onClick={irParaCadastro}
                            >
                                Cadastre-se
                            </button>
                        </div>

                    </div>

                </div>

            </div>

            <Footer />

        </div>

    );

}

export default Login;