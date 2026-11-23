import React, { useState } from 'react';
import './Cadastrar.css';
import Footer from "../Components/Footer.jsx";

const Cadastrar = ({ voltar, irParaConfirmacao }) => {

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);


    const handleSubmit = async (e) => {

        e.preventDefault();

        setErro("");

        const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
            !nome.trim() ||
            !email.trim() ||
            !senha.trim() ||
            !confirmarSenha.trim()
        ) {
            setErro("Preencha todos os campos.");
            return;
        }

        if (!emailValido.test(email)) {
            setErro("Digite um e-mail válido.");
            return;
        }

        if (senha !== confirmarSenha) {
            setErro("As senhas não coincidem.");
            return;
        }


        const senhaForte =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

        if (!senhaForte.test(senha)) {

            setErro(
                "A senha deve conter no mínimo 8 caracteres, letra maiúscula, minúscula e número."
            );

            return;

        }

        setCarregando(true);

        try {

            const formData = new FormData();

            formData.append("nome", nome);
            formData.append("email", email);
            formData.append("senha", senha);

            const response = await fetch(
                "http://127.0.0.1:5000/criar_usuario",
                {
                    method: "POST",
                    body: formData
                }
            );


            const texto = await response.text();

            let data = {};

            try {

                data = JSON.parse(texto);

            } catch {

                setErro("Erro inesperado do servidor.");
                setCarregando(false);
                return;

            }


            if (response.ok) {

                irParaConfirmacao(
                    email,
                    data.id_usuario
                );

            } else {

                setErro(
                    data.erro ||
                    "Erro ao cadastrar usuário."
                );

            }

        } catch (error) {

            console.log(error);

            setErro(
                "Erro ao conectar com servidor."
            );

        }

        setCarregando(false);

    };

    return (

        <div className="cadastro-page">

            <div className="content-wrapper">


                <div className="logo-container">

                    <h1 className="logo-text">
                        Nana<span>Nenem</span>
                    </h1>

                </div>

                {/* CARD */}

                <div className="cadastro-card">

                    <h2 className="cadastro-title">
                        CADASTRO
                    </h2>


                    {erro && (

                        <div className="error-message">
                            {erro}
                        </div>

                    )}


                    <form onSubmit={handleSubmit}>


                        <div className="input-group">

                            <label>
                                Nome completo
                            </label>

                            <input
                                type="text"
                                placeholder="Digite seu nome"
                                value={nome}
                                onChange={(e) =>
                                    setNome(e.target.value)
                                }
                                disabled={carregando}
                            />

                        </div>


                        <div className="input-group">

                            <label>
                                Email
                            </label>

                            <input
                                type="email"
                                placeholder="Digite seu email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                disabled={carregando}
                            />

                        </div>


                        <div className="input-group">

                            <label>
                                Senha
                            </label>

                            <input
                                type="password"
                                placeholder="Digite sua senha"
                                value={senha}
                                onChange={(e) =>
                                    setSenha(e.target.value)
                                }
                                disabled={carregando}
                            />

                        </div>


                        <div className="input-group">

                            <label>
                                Confirmar senha
                            </label>

                            <input
                                type="password"
                                placeholder="Confirme sua senha"
                                value={confirmarSenha}
                                onChange={(e) =>
                                    setConfirmarSenha(e.target.value)
                                }
                                disabled={carregando}
                            />

                        </div>


                        <button
                            type="submit"
                            className="btn-cadastrar"
                            disabled={carregando}
                        >

                            {carregando
                                ? "Cadastrando..."
                                : "Cadastrar"}

                        </button>

                    </form>


                    <div className="back-link">

                        <span onClick={voltar}>
                            Voltar para login
                        </span>

                    </div>

                </div>

            </div>

            {/* FOOTER */}

            <Footer />

        </div>

    );

};

export default Cadastrar;