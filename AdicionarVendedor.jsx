import React, { useState } from "react";
import "./AdicionarVendedor.css";
import Footer from "../Components/Footer";

export default function AdicionarVendedor({
                                              voltar,
                                              sair,
                                              irParaEditar,
                                              irParaProdutos,
                                              irParaListarVendedor,
                                              onCadastroSucesso
                                          }) {

    // Mesmo padrão do HomeAdmin: menu lateral com item ativo
    const [menuAtivo, setMenuAtivo] = useState("usuarios");

    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [telefone, setTelefone] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [foto, setFoto] = useState(null);

    const [erro, setErro] = useState("");
    const [mensagem, setMensagem] = useState("");

    const validarFormulario = () => {

        if (!nome.trim()) {
            setErro("Informe o nome do vendedor.");
            return false;
        }

        if (nome.trim().length < 3) {
            setErro("O nome deve possuir pelo menos 3 caracteres.");
            return false;
        }

        if (cpf.length !== 11) {
            setErro("O CPF deve possuir exatamente 11 números.");
            return false;
        }

        if (telefone.length < 10 || telefone.length > 11) {
            setErro("O telefone deve possuir 10 ou 11 números.");
            return false;
        }

        const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailValido.test(email)) {
            setErro("Digite um e-mail válido.");
            return false;
        }

        const senhaForte =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

        if (!senhaForte.test(senha)) {
            setErro(
                "A senha deve ter no mínimo 8 caracteres, letra maiúscula, minúscula, número e caractere especial."
            );
            return false;
        }

        if (!foto) {
            setErro("Selecione uma foto.");
            return false;
        }

        return true;
    };

    const cadastrarVendedor = async (e) => {

        e.preventDefault();

        setErro("");
        setMensagem("");

        if (!validarFormulario()) {
            return;
        }

        try {

            const formData = new FormData();

            formData.append("nome", nome);
            formData.append("cpf", cpf);
            formData.append("telefone", telefone);
            formData.append("email", email);
            formData.append("senha", senha);
            formData.append("foto", foto);

            const response = await fetch(
                "http://127.0.0.1:5000/cadastrar_vendedor",
                {
                    method: "POST",
                    body: formData
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.erro || "Erro ao cadastrar vendedor.");
            }

            setMensagem("Vendedor cadastrado com sucesso!");

            setNome("");
            setCpf("");
            setTelefone("");
            setEmail("");
            setSenha("");
            setFoto(null);

            setTimeout(() => {
                if (onCadastroSucesso) {
                    onCadastroSucesso();
                }
            }, 1000);

        } catch (error) {

            setErro(
                error.message || "Não foi possível cadastrar o vendedor."
            );
        }
    };

    return (

        <div className="pagina-adicionar">

            <div className="home-adicionar">

                <aside className="sidebar-adicionar">

                    <div>

                        <div className="logo-area-adicionar">
                            <h1 className="logo-adicionar">
                                NanaNeném
                            </h1>
                        </div>

                        <nav className="menu-adicionar">

                            <button
                                className={
                                    menuAtivo === "dashboard"
                                        ? "ativo-adicionar dashboard"
                                        : "dashboard"
                                }
                                onClick={() => {
                                    setMenuAtivo("dashboard");
                                    if (voltar) voltar();
                                }}
                            >
                                Dashboard
                            </button>

                            <button
                                className={
                                    menuAtivo === "produtos"
                                        ? "ativo-adicionar produtos"
                                        : "produtos"
                                }
                                onClick={() => {
                                    setMenuAtivo("produtos");
                                    if (irParaProdutos) irParaProdutos();
                                }}
                            >
                                Produtos
                            </button>

                            <button
                                className={
                                    menuAtivo === "clientes"
                                        ? "ativo-adicionar clientes"
                                        : "clientes"
                                }
                                onClick={() => setMenuAtivo("clientes")}
                            >
                                Clientes
                            </button>

                            <button
                                className={
                                    menuAtivo === "pedidos"
                                        ? "ativo-adicionar pedidos"
                                        : "pedidos"
                                }
                                onClick={() => setMenuAtivo("pedidos")}
                            >
                                Pedidos
                            </button>

                            <button
                                className={
                                    menuAtivo === "usuarios"
                                        ? "ativo-adicionar usuarios"
                                        : "usuarios"
                                }
                                onClick={() => {
                                    setMenuAtivo("usuarios");
                                    if (irParaListarVendedor) irParaListarVendedor();
                                }}
                            >
                                Usuários
                            </button>

                            <button
                                className={
                                    menuAtivo === "financeiro"
                                        ? "ativo-adicionar financeiro"
                                        : "financeiro"
                                }
                                onClick={() => setMenuAtivo("financeiro")}
                            >
                                Faturamento
                            </button>

                        </nav>

                    </div>

                    <button
                        className="btn-sidebar-sair"
                        onClick={sair}
                    >
                        ⏻ Sair
                    </button>

                </aside>

                <main className="conteudo-adicionar">

                    <section className="topo-adicionar">

                        <div className="topo-textos">
                            <h1>Adicionar Vendedor</h1>
                            <p>Cadastre um novo vendedor</p>
                        </div>

                        <div className="topo-direita">

                            <div
                                className="perfil"
                                onClick={irParaEditar}
                            ></div>

                        </div>

                    </section>

                    <section className="acoes-adicionar">

                        <button
                            className="btn-admin-adicionar vermelho-btn"
                            onClick={voltar}
                        >
                            Voltar
                        </button>

                    </section>

                    <section className="box-formulario">

                        <h2>Dados do Vendedor</h2>

                        {erro && (
                            <div className="mensagem-erro">
                                {erro}
                            </div>
                        )}

                        {mensagem && (
                            <div className="mensagem-sucesso">
                                {mensagem}
                            </div>
                        )}

                        <form
                            className="formulario"
                            onSubmit={cadastrarVendedor}
                        >

                            <div className="linha-form">
                                <label>Nome Completo</label>

                                <input
                                    type="text"
                                    placeholder="Digite o nome completo"
                                    value={nome}
                                    onChange={(e) =>
                                        setNome(e.target.value.replace(/[0-9]/g, ""))
                                    }
                                />
                            </div>

                            <div className="linha-form">
                                <label>CPF</label>

                                <input
                                    type="text"
                                    placeholder="Somente números"
                                    maxLength={11}
                                    value={cpf}
                                    onChange={(e) =>
                                        setCpf(e.target.value.replace(/\D/g, ""))
                                    }
                                />
                            </div>

                            <div className="linha-form">
                                <label>Telefone</label>

                                <input
                                    type="text"
                                    placeholder="Somente números"
                                    maxLength={11}
                                    value={telefone}
                                    onChange={(e) =>
                                        setTelefone(e.target.value.replace(/\D/g, ""))
                                    }
                                />
                            </div>

                            <div className="linha-form">
                                <label>Email</label>

                                <input
                                    type="email"
                                    placeholder="Digite o e-mail"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="linha-form">
                                <label>Senha</label>

                                <input
                                    type="password"
                                    placeholder="Senha forte"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                />
                            </div>

                            <div className="linha-form">
                                <label>Foto do vendedor</label>

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setFoto(e.target.files[0])}
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn-adicionar"
                            >
                                Cadastrar Vendedor
                            </button>

                        </form>

                    </section>

                </main>

            </div>

            <Footer />

        </div>

    );
}