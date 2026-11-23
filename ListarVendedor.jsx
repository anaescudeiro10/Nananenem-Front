import React, { useEffect, useState } from "react";
import "./ListarVendedor.css";
import Footer from "../Components/Footer";

export default function ListarVendedor({
                                           voltar,
                                           sair,
                                           irParaEditar,
                                           irParaAdicionarVendedor,
                                           irParaExcluirVendedor
                                       }) {
    const [usuarios, setUsuarios] = useState([]);
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [busca, setBusca] = useState("");

    useEffect(() => {
        buscarUsuarios();
    }, []);

    const buscarUsuarios = async () => {
        setCarregando(true);
        setErro("");

        try {
            const response = await fetch("http://127.0.0.1:5000/usuarios");

            if (!response.ok) {
                throw new Error("Erro ao buscar usuários");
            }

            const data = await response.json();

            const vendedores = data.filter(
                (u) => u.tipo && u.tipo.toUpperCase().trim() === "VENDEDOR"
            );

            setUsuarios(vendedores);
        } catch (error) {
            console.error(error);
            setErro("Erro ao carregar vendedores.");
        } finally {
            setCarregando(false);
        }
    };

    const vendedoresFiltrados = usuarios.filter((u) => {
        const termo = busca.toLowerCase().trim();
        if (!termo) return true;
        return (
            (u.nome || "").toLowerCase().includes(termo) ||
            (u.email || "").toLowerCase().includes(termo)
        );
    });

    const total = usuarios.length;
    const ativos = usuarios.filter((u) => u.bloqueado === "Não").length;
    const desativados = total - ativos;

    const formatarId = (id) => `#${String(id).padStart(3, "0")}`;

    return (
        <div className="lv-pagina">
            <div className="lv-layout">

                {/* SIDEBAR */}
                <aside className="lv-sidebar">
                    <div>
                        <h1 className="lv-logo">NanaNeném</h1>

                        <nav className="lv-menu">
                            <button className="lv-menu-btn lv-menu-ativo" onClick={voltar}>
                                Dashboard
                            </button>
                            <button className="lv-menu-btn lv-cor-produtos">Produtos</button>
                            <button className="lv-menu-btn lv-cor-clientes">Clientes</button>
                            <button className="lv-menu-btn lv-cor-pedidos">Pedidos</button>
                            <button className="lv-menu-btn lv-cor-usuarios">Usuários</button>
                            <button className="lv-menu-btn lv-cor-faturamento">Faturamento</button>
                        </nav>
                    </div>

                    <button className="lv-btn-sair" onClick={sair}>
                        ⏻ Sair
                    </button>
                </aside>

                {/* CONTEÚDO */}
                <main className="lv-conteudo">

                    {/* TOPO */}
                    <section className="lv-topo">
                        <div className="lv-topo-textos">
                            <h1>Listar Vendedores</h1>
                            <p>Vendedores cadastrados no sistema</p>
                        </div>

                        <div className="lv-topo-direita">
                            <div className="lv-busca">
                                <input
                                    placeholder="Buscar..."
                                    value={busca}
                                    onChange={(e) => setBusca(e.target.value)}
                                />
                            </div>

                            <div className="lv-perfil" onClick={irParaEditar}></div>
                        </div>
                    </section>

                    <div className="lv-corpo">

                        {/* BOTÕES */}
                        <div className="lv-botoes">
                            <button
                                className="lv-btn lv-btn-verde"
                                onClick={irParaAdicionarVendedor}
                            >
                                + Novo vendedor
                            </button>

                            <button
                                className="lv-btn lv-btn-rosa"
                                onClick={irParaExcluirVendedor}
                            >
                                Excluir vendedor
                            </button>
                        </div>

                        {/* CARDS RESUMO */}
                        <div className="lv-cards">
                            <div className="lv-resumo lv-resumo-azul">
                                <h2>Total de vendedores</h2>
                                <span className="lv-numero">{total}</span>
                            </div>

                            <div className="lv-resumo lv-resumo-verde">
                                <h2>Vendedores ativos</h2>
                                <span className="lv-numero">{ativos}</span>
                            </div>

                            <div className="lv-resumo lv-resumo-rosa">
                                <h2>Vendedores desativados</h2>
                                <span className="lv-numero">{desativados}</span>
                            </div>
                        </div>

                        {/* TABELA */}
                        <section className="lv-card">
                            <h2>Vendedores Cadastrados</h2>

                            {erro && <div className="lv-erro">{erro}</div>}

                            {carregando ? (
                                <p className="lv-carregando">Carregando...</p>
                            ) : (
                                <div className="lv-tabela-wrap">
                                    <table className="lv-tabela">
                                        <thead>
                                        <tr>
                                            <th className="lv-col-id">ID</th>
                                            <th className="lv-col-texto">Vendedores</th>
                                            <th className="lv-col-texto">Email</th>
                                            <th className="lv-col-status">Status</th>
                                        </tr>
                                        </thead>

                                        <tbody>
                                        {vendedoresFiltrados.length > 0 ? (
                                            vendedoresFiltrados.map((usuario) => (
                                                <tr key={usuario.id}>
                                                    <td className="lv-col-id">
                                                        {formatarId(usuario.id)}
                                                    </td>
                                                    <td className="lv-col-texto">
                                                        {usuario.nome}
                                                    </td>
                                                    <td className="lv-col-texto">
                                                        {usuario.email}
                                                    </td>
                                                    <td className="lv-col-status">
                                                            <span
                                                                className={
                                                                    usuario.bloqueado === "Não"
                                                                        ? "lv-status lv-status-ativo"
                                                                        : "lv-status lv-status-desativado"
                                                                }
                                                            >
                                                                {usuario.bloqueado === "Não"
                                                                    ? "Ativo"
                                                                    : "Desativado"}
                                                            </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="lv-vazio">
                                                    Nenhum vendedor encontrado
                                                </td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>

                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
}