import React, { useEffect, useState } from "react";
import "./Produtos.css";
import Footer from "../Components/Footer";

export default function ProdutosVendedor({
                                             voltar,
                                             sair,
                                             irParaEditar
                                         }) {

    const baseURL = "http://localhost:5000";

    const [produtos, setProdutos] = useState([]);

    useEffect(() => {
        carregarProdutos();

        // Atualiza automaticamente a cada 5s
        const interval = setInterval(() => {
            carregarProdutos();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    async function carregarProdutos() {
        try {
            const response = await fetch(`${baseURL}/produtos`);
            const data = await response.json();
            setProdutos(data);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="pagina-produtos">

            <div className="home-produtos">

                {/* SIDEBAR */}
                <aside className="sidebar-produtos">

                    <div>
                        <h1 className="logo-produtos">
                            NanaNeném
                        </h1>

                        <nav className="menu-produtos">

                            <button onClick={voltar}>
                                Dashboard
                            </button>

                            <button className="ativo">
                                Produtos
                            </button>

                            <button>
                                Pedidos
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

                {/* CONTEÚDO */}
                <main className="conteudo-produtos">

                    <section className="topo-produtos">

                        <div className="topo-textos">
                            <h1>Produtos</h1>
                            <p>Catálogo disponível</p>
                        </div>

                        <div className="topo-direita">

                            <div className="buscar">
                                <input placeholder="Buscar produto..." />
                            </div>

                            <div
                                className="perfil"
                                onClick={irParaEditar}
                            ></div>

                        </div>

                    </section>

                    <div className="titulo-produtos">
                        Produtos Disponíveis
                    </div>

                    {/* GRID */}
                    <section className="grid-produtos">

                        {produtos.map((produto) => (

                            <div
                                className="card-produto"
                                key={produto.id_produto}
                            >

                                <img
                                    src={produto.imagem}
                                    alt={produto.nome}
                                />

                                <div className="card-body">

                                    <h3>{produto.nome}</h3>

                                    <p>{produto.descricao}</p>

                                    <span className="preco">
                                        R$ {produto.preco}
                                    </span>

                                    <div className="grade-card">

                                        {produto.grade?.length > 0 ? (

                                            produto.grade.map((item, index) => (

                                                <div
                                                    className="item-grade"
                                                    key={index}
                                                >

                                                    <div className="grade-info">
                                                        <span>{item.cor}</span>
                                                        <span>Tam. {item.tamanho}</span>
                                                    </div>

                                                    <div className="estoque-grade">
                                                        {item.estoque} un.
                                                    </div>

                                                </div>

                                            ))

                                        ) : (

                                            <div className="sem-grade">
                                                Sem grade cadastrada
                                            </div>

                                        )}

                                    </div>

                                </div>

                            </div>

                        ))}

                    </section>

                </main>

            </div>

            <Footer />

        </div>
    );
}