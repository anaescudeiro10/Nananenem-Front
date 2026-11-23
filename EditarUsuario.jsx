import React, { useEffect, useState } from "react";
import "./EditarUsuario.css";
import Footer from "../Components/Footer";

function EditarUsuario({ usuarioLogado, voltar }) {

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const [foto, setFoto] = useState(null);
    const [preview, setPreview] = useState(null);

    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState(false);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {

        if (!usuarioLogado) {
            setCarregando(false);
            return;
        }

        const carregarUsuario = async () => {

            try {

                const res = await fetch(
                    `http://localhost:5000/usuario/${usuarioLogado}`
                );

                const dados = await res.json();

                if (!res.ok) {
                    setMensagem(dados.erro);
                    setErro(true);
                    return;
                }

                setNome(dados.nome || "");
                setEmail(dados.email || "");

                if (dados.foto) {
                    setPreview(
                        `http://localhost:5000/static/fotos/${dados.foto}`
                    );
                }

            } catch (err) {
                console.error(err);
                setMensagem("Erro ao carregar usuário");
                setErro(true);
            } finally {
                setCarregando(false);
            }
        };

        carregarUsuario();

    }, [usuarioLogado]);

    const selecionarFoto = (e) => {

        const arquivo = e.target.files[0];

        if (!arquivo) return;

        setFoto(arquivo);

        const url = URL.createObjectURL(arquivo);

        setPreview(url);
    };

    const salvarAlteracoes = async (e) => {

        e.preventDefault();

        setMensagem("");
        setErro(false);

        // Nome obrigatório
        if (!nome.trim()) {
            setMensagem("O nome é obrigatório.");
            setErro(true);
            return;
        }

        // Email obrigatório
        if (!email.trim()) {
            setMensagem("O email é obrigatório.");
            setErro(true);
            return;
        }

        // Validação de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            setMensagem("Digite um email válido.");
            setErro(true);
            return;
        }

        // Senha forte (somente se o usuário digitou)
        if (senha) {

            const senhaForte =
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

            if (!senhaForte.test(senha)) {

                setMensagem(
                    "A senha deve ter no mínimo 8 caracteres, uma letra maiúscula, uma minúscula e um número."
                );

                setErro(true);
                return;
            }
        }

        try {

            const formData = new FormData();

            formData.append("nome", nome);
            formData.append("email", email);
            formData.append("senha", senha);

            const res = await fetch(
                `http://localhost:5000/usuario/${usuarioLogado}`,
                {
                    method: "PUT",
                    body: formData
                }
            );

            const dados = await res.json();

            if (!res.ok) {

                setMensagem(
                    dados.erro || "Erro ao atualizar usuário"
                );

                setErro(true);
                return;
            }

            setMensagem("Usuário atualizado com sucesso!");
            setErro(false);

            setTimeout(() => {
                voltar();
            }, 1500);

        } catch (err) {

            console.error(err);

            setMensagem("Erro ao conectar com o servidor.");
            setErro(true);
        }
    };

    if (carregando) {
        return <h2>Carregando...</h2>;
    }

    return (
        <div className="editar-page">

            <div className="editar-container">

                <button
                    className="btn-voltar"
                    onClick={voltar}
                >
                     Voltar
                </button>

                <div className="card-editar">

                    <h2 className="titulo-editar">
                        Editar Usuário
                    </h2>

                    <div className="foto-area">

                        <label
                            htmlFor="fotoInput"
                            className="foto-perfil"
                        >

                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Foto do usuário"
                                />
                            ) : (
                                "foto"
                            )}

                        </label>

                        <input
                            id="fotoInput"
                            type="file"
                            accept="image/*"
                            onChange={selecionarFoto}
                            hidden
                        />

                    </div>

                    {mensagem && (
                        <div
                            className={`mensagem ${
                                erro ? "erro" : "sucesso"
                            }`}
                        >
                            {mensagem}
                        </div>
                    )}

                    <form onSubmit={salvarAlteracoes}>

                        <div className="input-group">
                            <label>Nome</label>

                            <input
                                type="text"
                                value={nome}
                                onChange={(e) =>
                                    setNome(e.target.value)
                                }
                            />
                        </div>

                        <div className="input-group">
                            <label>Email</label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                            />
                        </div>

                        <div className="input-group">
                            <label>Nova senha</label>

                            <input
                                type="password"
                                value={senha}
                                onChange={(e) =>
                                    setSenha(e.target.value)
                                }
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-editar"
                        >
                            Salvar Alterações
                        </button>

                    </form>

                </div>

            </div>

            <Footer />

        </div>
    );
}

export default EditarUsuario;