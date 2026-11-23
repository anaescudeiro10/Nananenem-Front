import React, { useEffect, useState } from "react";
import "./PedidosVendedor.css";

export default function PedidosVendedor({ irParaNovo, irParaDetalhe, mudarTela }) {

    const [pedidos, setPedidos] = useState([]);
    const [busca, setBusca] = useState("");
    const [filtro, setFiltro] = useState("todos");

    useEffect(() => {
        fetch("http://localhost:5000/pedidos")
            .then(res => res.json())
            .then(data => setPedidos(data))
            .catch(() => setPedidos([]));
    }, []);

    const pedidosFiltrados = pedidos.filter((p) => {
        const matchBusca = p.cliente.toLowerCase().includes(busca.toLowerCase());
        const matchStatus = filtro === "todos" || p.status === filtro;
        return matchBusca && matchStatus;
    });

    return (
        <div className="pagina-vendedor">

            <div className="home-vendedor">

                {/* SIDEBAR */}
                <aside className="sidebar-vendedor">

                    <div>
                        <div className="logo-area">
                            <h1 className="logo-vendedor">NanaNeném</h1>
                        </div>

                        <div className="menu-vendedor">
                            <button className="dashboard" onClick={() => mudarTela("home")}>
                                Dashboard
                            </button>

                            <button className="produtos" onClick={() => mudarTela("produtos")}>
                                Produtos
                            </button>

                            <button className="pedidos ativo">
                                Pedidos
                            </button>

                            <button className="estoque">
                                Produtos sem estoque
                            </button>
                        </div>
                    </div>

                    <button className="btn-sidebar-sair">⏻ Sair</button>
                </aside>

                {/* CONTEÚDO */}
                <div className="conteudo-vendedor">

                    <div className="main-vendedor">

                        {/* HEADER IGUAL SEU HOME */}
                        <div className="topo-vendedor">

                            <div className="topo-textos">
                                <h1>Pedidos</h1>
                                <p>Gerencie seus pedidos</p>
                            </div>

                            <div className="topo-direita">

                                <div className="buscar">
                                    <input
                                        type="text"
                                        placeholder="Buscar cliente..."
                                        value={busca}
                                        onChange={(e) => setBusca(e.target.value)}
                                    />
                                </div>

                                <button className="btn-sair-topo">
                                    Sair
                                </button>

                                <div className="perfil"></div>

                            </div>

                        </div>

                        {/* BOTÃO */}
                        <button className="btn-pedido" onClick={irParaNovo}>
                            + Novo Pedido
                        </button>

                        {/* CARDS */}
                        <div className="cards-vendedor">

                            <div className="card azul">
                                <p>Total de pedidos</p>
                                <div className="numero-card">{pedidos.length}</div>
                            </div>

                            <div className="card amarelo">
                                <p>Entregues</p>
                                <div className="numero-card">
                                    {pedidos.filter(p => p.status === "entregue").length}
                                </div>
                            </div>

                            <div className="card laranja">
                                <p>Pendentes</p>
                                <div className="numero-card">
                                    {pedidos.filter(p => p.status === "criado").length}
                                </div>
                            </div>

                        </div>

                        {/* TABELA */}
                        <div className="tabela-vendedor">

                            <h2>Lista de Pedidos</h2>

                            <table>
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Cliente</th>
                                    <th>Data</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                                </thead>

                                <tbody>

                                {pedidosFiltrados.map((p) => (

                                    <tr key={p.id}>
                                        <td>#{p.id}</td>
                                        <td>{p.cliente}</td>
                                        <td>{p.data}</td>
                                        <td>R$ {p.total}</td>

                                        <td>
                                                <span className={`status ${p.status}`}>
                                                    {p.status}
                                                </span>
                                        </td>

                                        <td>
                                            <button onClick={() => irParaDetalhe(p)}>
                                                Ver
                                            </button>
                                        </td>
                                    </tr>

                                ))}

                                </tbody>
                            </table>

                        </div>

                    </div>

                    {/* FOOTER */}
                    <footer className="footer-vendedor">
                        <p>© 2026 NanaNeném • Sistema de Vendas</p>
                    </footer>

                </div>

            </div>

        </div>
    );
}