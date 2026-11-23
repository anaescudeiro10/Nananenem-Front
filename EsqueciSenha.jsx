import { useState } from "react";
import "./EsqueciSenha.css";
import Footer from "../Components/Footer";

function EsqueciSenha({ voltarLogin }) {

    const [etapa, setEtapa] = useState(1);

    const [email, setEmail] = useState("");
    const [codigo, setCodigo] = useState("");
    const [novaSenha, setNovaSenha] = useState("");

    const [mensagem, setMensagem] = useState("");
    const [tipoMsg, setTipoMsg] = useState("");

    const [loading, setLoading] = useState(false);



    const enviarCodigo = async () => {

        setMensagem("");

        if (!email.trim()) {
            setTipoMsg("erro");
            setMensagem("Digite seu email.");
            return;
        }

        const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailValido.test(email)) {
            setTipoMsg("erro");
            setMensagem("Digite um e-mail válido.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(
                "http://127.0.0.1:5000/solicitar_recuperacao",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded",
                    },
                    body: new URLSearchParams({
                        email
                    }),
                }
            );

            const data = await res.json();

            if (res.ok) {

                setTipoMsg("sucesso");

                setMensagem(
                    "Código enviado para seu email!"
                );

                setEtapa(2);

            } else {

                setTipoMsg("erro");

                setMensagem(
                    data.erro || "Erro ao enviar código."
                );

            }

        } catch {

            setTipoMsg("erro");

            setMensagem(
                "Erro ao conectar com servidor."
            );
        }

        setLoading(false);
    };



    const alterarSenha = async () => {

        setMensagem("");

        if (!codigo || !novaSenha) {

            setTipoMsg("erro");

            setMensagem(
                "Preencha todos os campos."
            );

            return;
        }


        if (codigo.length !== 6) {

            setTipoMsg("erro");

            setMensagem(
                "O código deve ter 6 dígitos."
            );

            return;
        }


        const senhaForte =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

        if (!senhaForte.test(novaSenha)) {

            setTipoMsg("erro");

            setMensagem(
                "A senha deve ter no mínimo 8 caracteres, uma letra maiúscula, uma minúscula e um número."
            );

            return;
        }


        const senhaAtual =
            localStorage.getItem("ultimaSenha");

        if (
            senhaAtual &&
            novaSenha === senhaAtual
        ) {

            setTipoMsg("erro");

            setMensagem(
                "Você não pode usar sua senha atual."
            );

            return;
        }


        const historico = JSON.parse(
            localStorage.getItem(
                "historicoSenhas"
            )
        ) || [];

        if (historico.includes(novaSenha)) {

            setTipoMsg("erro");

            setMensagem(
                "Você não pode reutilizar suas últimas 3 senhas."
            );

            return;
        }

        setLoading(true);

        try {

            const res = await fetch(
                "http://127.0.0.1:5000/redefinir_senha",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded",
                    },

                    body: new URLSearchParams({

                        email,
                        codigo,
                        nova_senha: novaSenha

                    }),
                }
            );

            const data = await res.json();

            if (res.ok) {


                localStorage.setItem(
                    "ultimaSenha",
                    novaSenha
                );

                let historico = JSON.parse(
                    localStorage.getItem(
                        "historicoSenhas"
                    )
                ) || [];

                historico.unshift(novaSenha);


                historico = historico.slice(0, 3);

                localStorage.setItem(
                    "historicoSenhas",
                    JSON.stringify(historico)
                );

                setTipoMsg("sucesso");

                setMensagem(
                    "Senha alterada com sucesso!"
                );

                setTimeout(() => {

                    voltarLogin();

                }, 1500);

            } else {

                setTipoMsg("erro");

                setMensagem(
                    data.erro || "Erro ao alterar senha."
                );

            }

        } catch {

            setTipoMsg("erro");

            setMensagem(
                "Erro ao conectar."
            );

        }

        setLoading(false);
    };

    return (

        <div className="esqueci-page">

            <div className="content-wrapper">


                <div className="logo-container">

                    <h1 className="logo-text">
                        Nana<span>Nenem</span>
                    </h1>

                </div>


                <div className="esqueci-box">

                    <h2 className="esqueci-title">
                        ESQUECI SENHA
                    </h2>

                    {mensagem && (

                        <div className={`alert ${tipoMsg}`}>

                            {mensagem}

                        </div>

                    )}


                    {etapa === 1 && (

                        <>

                            <div className="input-group">

                                <label>
                                    E-mail
                                </label>

                                <input
                                    type="email"
                                    placeholder="Digite seu e-mail"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                            <button
                                className="btn-enviar"
                                onClick={enviarCodigo}
                                disabled={loading}
                            >

                                {loading
                                    ? "Enviando..."
                                    : "Enviar Código"}

                            </button>

                        </>

                    )}


                    {etapa === 2 && (

                        <>

                            <div className="input-group">

                                <label>
                                    Código
                                </label>

                                <input
                                    type="text"
                                    placeholder="Digite o código"
                                    value={codigo}
                                    maxLength={6}
                                    inputMode="numeric"

                                    onChange={(e) => {

                                        const valor =
                                            e.target.value
                                                .replace(/\D/g, "")
                                                .slice(0, 6);

                                        setCodigo(valor);

                                    }}
                                />

                            </div>

                            <div className="input-group">

                                <label>
                                    Nova senha
                                </label>

                                <input
                                    type="password"
                                    placeholder="Digite sua nova senha"
                                    value={novaSenha}
                                    onChange={(e) =>
                                        setNovaSenha(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                            <button
                                className="btn-enviar"
                                onClick={alterarSenha}
                                disabled={loading}
                            >

                                {loading
                                    ? "Salvando..."
                                    : "Alterar Senha"}

                            </button>

                        </>

                    )}

                    <div className="back-link">

                        <span onClick={voltarLogin}>

                            Voltar para login

                        </span>

                    </div>

                </div>

            </div>

            <Footer />

        </div>
    );
}

export default EsqueciSenha;