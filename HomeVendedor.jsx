import React, { useState } from "react";
import "./HomeVendedor.css";
import Footer from "../Components/Footer";

const ultimosPedidos = [
    { id: "#001", cliente: "Ana Oliveira", valor: "R$ 217,00", status: "aprovado", textoStatus: "Aprovado", data: "24/05/2025" },
    { id: "#002", cliente: "Davi Sousa", valor: "R$ 320,00", status: "criado", textoStatus: "Criado", data: "24/05/2025" },
    { id: "#003", cliente: "Otavio Santos", valor: "R$ 3.230,00", status: "cancelado", textoStatus: "Cancelado", data: "24/05/2025" },
    { id: "#004", cliente: "Livia Silva", valor: "R$ 460,00", status: "aprovado", textoStatus: "Aprovado", data: "24/05/2025" }
];

export default function HomeVendedor({
                                         sair,
                                         irParaEditar,
                                         irParaProdutos,
                                         irParaPedidos
                                     }) {

    const [menuAtivo, setMenuAtivo] = useState("dashboard");

    return (

        <div className="pagina-vendedor">

            <div className="home-vendedor">

                <aside className="sidebar-vendedor">

                    <div>

                        <div className="logo-area">
                            <h1 className="logo-vendedor">
                                NanaNeném
                            </h1>
                        </div>

                        <nav className="menu-vendedor">

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
                                onClick={irParaProdutos}
                            >
                                Produtos
                            </button>

                            <button
                                className={
                                    menuAtivo === "pedidos"
                                        ? "ativo pedidos"
                                        : "pedidos"
                                }
                                onClick={irParaPedidos}
                            >
                                Pedidos
                            </button>

                            <button
                                className={
                                    menuAtivo === "estoque"
                                        ? "ativo estoque"
                                        : "estoque"
                                }
                                onClick={() => setMenuAtivo("estoque")}
                            >
                                Produtos sem estoque
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

                <main className="conteudo-vendedor">

                    <section className="topo-vendedor">

                        <div className="topo-textos">
                            <h1>Vendedor logado</h1>
                            <p>Página do Vendedor</p>
                        </div>

                        <div className="topo-direita">

                            <div className="buscar">
                                <input
                                    type="text"
                                    placeholder="Buscar..."
                                />
                            </div>

                            <button
                                className="btn-sair-topo"
                                onClick={sair}
                            >
                                Sair
                            </button>

                            <div
                                className="perfil"
                                onClick={irParaEditar}
                            ></div>

                        </div>

                    </section>

                    <button className="btn-pedido">
                        + novo pedido
                    </button>

                    <section className="cards-vendedor">

                        <div className="card azul">
                            <p>Pedidos Pendentes</p>
                            <div className="numero-card">20</div>
                        </div>

                        <div className="card amarelo">
                            <p>Produtos em estoque</p>
                            <div className="numero-card">50</div>
                        </div>

                        <div className="card laranja">
                            <p>Produtos sem estoque</p>
                            <div className="numero-card">10</div>
                        </div>

                    </section>

                    <section className="tabela-vendedor">

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

                    <section className="cards-status">

                        <div className="card-status card-criado">
                            <span></span>
                            <span>Criado</span>
                            <span>22</span>
                        </div>

                        <div className="card-status card-aprovado">
                            <span></span>
                            <span>Aprovado</span>
                            <span>47</span>
                        </div>

                        <div className="card-status card-cancelado">
                            <span></span>
                            <span>Cancelado</span>
                            <span>14</span>
                        </div>

                    </section>

                </main>

            </div>

            <Footer />

        </div>
    );
}