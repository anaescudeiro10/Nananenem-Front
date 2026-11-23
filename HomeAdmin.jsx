import React, { useState } from "react";
import "./HomeAdmin.css";
import Footer from "../Components/Footer";

const ultimosPedidos = [
    { id: "#001", cliente: "Ana Oliveira", valor: "R$ 217,00", status: "aprovado", textoStatus: "Aprovado", data: "24/05/2025" },
    { id: "#002", cliente: "Davi Sousa", valor: "R$ 320,00", status: "criado", textoStatus: "Criado", data: "24/05/2025" },
    { id: "#003", cliente: "Otavio Santos", valor: "R$ 3.230,00", status: "cancelado", textoStatus: "Cancelado", data: "24/05/2025" },
    { id: "#004", cliente: "Livia Silva", valor: "R$ 460,00", status: "aprovado", textoStatus: "Aprovado", data: "24/05/2025" }
];

// Valores de exemplo: troque pelos dados reais quando tiver o back-end
const faturamento = "R$ 677,00";
const produtosSemEstoque = 5;

export default function HomeAdmin({
                                      sair,
                                      irParaEditar,
                                      irParaListarVendedor,
                                      irParaAdicionarVendedor,
                                      irParaProdutos
                                  }) {

    const [menuAtivo, setMenuAtivo] = useState("dashboard");

    return (

        <div className="pagina-admin">

            <div className="home-admin">

                <aside className="sidebar-admin">

                    <div>

                        <div className="logo-area">
                            <h1 className="logo-admin">
                                NanaNeném
                            </h1>
                        </div>

                        <nav className="menu-admin">

                            <button
                                className={
                                    menuAtivo === "dashboard"
                                        ? "ativo dashboard"
                                        : "dashboard"
                                }
                                onClick={() => setMenuAtivo("dashboard")}
                            >
                                Dashboard
                            </button>

                            <button
                                className={
                                    menuAtivo === "produtos"
                                        ? "ativo produtos"
                                        : "produtos"
                                }
                                onClick={() => {
                                    setMenuAtivo("produtos");
                                    irParaProdutos();
                                }}
                            >
                                Produtos
                            </button>

                            <button
                                className={
                                    menuAtivo === "clientes"
                                        ? "ativo clientes"
                                        : "clientes"
                                }
                                onClick={() => setMenuAtivo("clientes")}
                            >
                                Clientes
                            </button>

                            <button
                                className={
                                    menuAtivo === "pedidos"
                                        ? "ativo pedidos"
                                        : "pedidos"
                                }
                                onClick={() => setMenuAtivo("pedidos")}
                            >
                                Pedidos
                            </button>

                            <button
                                className={
                                    menuAtivo === "usuarios"
                                        ? "ativo usuarios"
                                        : "usuarios"
                                }
                                onClick={() => {
                                    setMenuAtivo("usuarios");
                                    irParaListarVendedor();
                                }}
                            >
                                Usuários
                            </button>

                            <button
                                className={
                                    menuAtivo === "financeiro"
                                        ? "ativo financeiro"
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

                <main className="conteudo-admin">

                    <section className="topo-admin">

                        <div className="topo-textos">
                            <h1>Olá Adm</h1>
                            <p>Painel administrativo NanaNeném</p>
                        </div>

                        <div className="topo-direita">

                            <div className="buscar">
                                <input
                                    type="text"
                                    placeholder="Buscar..."
                                />
                            </div>

                            <div
                                className="perfil"
                                onClick={irParaEditar}
                            ></div>

                        </div>

                    </section>

                    <section className="acoes-admin">

                        <button
                            className="btn-admin verde-btn"
                            onClick={irParaAdicionarVendedor}
                        >
                            + Novo vendedor
                        </button>

                        <button className="btn-admin azul-btn">
                            + Novo produto
                        </button>

                    </section>

                    <section className="cards-admin">

                        <div className="linha-cards">

                            <div className="card azul">
                                <div className="icone-titulo">
                                    <div className="icone-card azul-icone"></div>
                                    <h3>Pedidos<br />Pendentes</h3>
                                </div>
                                <div className="numero-card">20</div>
                            </div>

                            <div className="card amarelo">
                                <div className="icone-titulo">
                                    <div className="icone-card amarelo-icone"></div>
                                    <h3>Produtos<br />em estoque</h3>
                                </div>
                                <div className="numero-card">50</div>
                            </div>

                            <div className="card rosa">
                                <div className="icone-titulo">
                                    <div className="icone-card rosa-icone"></div>
                                    <h3>Clientes<br />cadastrados</h3>
                                </div>
                                <div className="numero-card">10</div>
                            </div>

                            <div className="card verde">
                                <div className="icone-titulo">
                                    <div className="icone-card verde-icone"></div>
                                    <h3>Vendedores</h3>
                                </div>
                                <div className="numero-card">10</div>
                            </div>

                        </div>

                        <div className="linha-cards-baixo">

                            <div className="card roxo">
                                <div className="icone-titulo">
                                    <div className="icone-card roxo-icone"></div>
                                    <h3>Faturamento</h3>
                                </div>
                                <div className="numero-card">{faturamento}</div>
                            </div>

                            <div className="card laranja">
                                <div className="icone-titulo">
                                    <div className="icone-card laranja-icone"></div>
                                    <h3>Produtos<br />sem estoque</h3>
                                </div>
                                <div className="numero-card">{produtosSemEstoque}</div>
                            </div>

                        </div>

                    </section>

                    <section className="tabela-admin">

                        <h2>Últimos Pedidos</h2>

                        <table>

                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Clientes</th>
                                <th>Valores</th>
                                <th>Status</th>
                                <th>Data</th>
                            </tr>
                            </thead>

                            <tbody>
                            {ultimosPedidos.map((pedido) => (
                                <tr key={pedido.id}>
                                    <td>{pedido.id}</td>
                                    <td>{pedido.cliente}</td>
                                    <td>{pedido.valor}</td>
                                    <td>
                                        <span className={`status ${pedido.status}`}>
                                            {pedido.textoStatus}
                                        </span>
                                    </td>
                                    <td>{pedido.data}</td>
                                </tr>
                            ))}
                            </tbody>

                        </table>

                    </section>

                    <section className="status-inferior">

                        <div className="status-box criado-box">
                            <span>Criado</span>
                            <strong>22</strong>
                        </div>

                        <div className="status-box aprovado-box">
                            <span>Aprovado</span>
                            <strong>47</strong>
                        </div>

                        <div className="status-box cancelado-box">
                            <span>Cancelado</span>
                            <strong>14</strong>
                        </div>

                    </section>

                </main>

            </div>

            <Footer />

        </div>

    );

}