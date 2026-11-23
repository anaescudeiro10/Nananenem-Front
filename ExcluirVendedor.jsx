import "./ExcluirVendedor.css";
import { useEffect, useState } from "react";

function ExcluirVendedor({
                             voltar,
                             sair,
                             irParaEditar,
                             irParaSucessoExcluir
                         }) {

    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalAberto, setModalAberto] = useState(false);
    const [vendedorSelecionado, setVendedorSelecionado] = useState(null);

    useEffect(() => {
        buscarUsuarios();
    }, []);

    async function buscarUsuarios() {

        try {

            const response = await fetch(
                "http://127.0.0.1:5000/usuarios"
            );

            const data = await response.json();

            console.log("Usuários recebidos:", data);

            if (response.ok) {

                const vendedores = data.filter(
                    (u) =>
                        u.tipo &&
                        u.tipo.toUpperCase().trim() === "VENDEDOR"
                );

                setUsuarios(vendedores);
            }

        } catch (error) {

            console.error(
                "Erro ao buscar vendedores:",
                error
            );

        } finally {

            setLoading(false);

        }

    }

    function abrirModal(id) {

        console.log("ID selecionado:", id);

        setVendedorSelecionado(id);
        setModalAberto(true);

    }

    async function confirmarExclusao() {

        try {

            const response = await fetch(
                `http://127.0.0.1:5000/excluir_usuario/${vendedorSelecionado}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            console.log("Resposta DELETE:", data);

            if (!response.ok) {
                throw new Error(
                    data.erro || "Erro ao excluir usuário."
                );
            }

            setUsuarios((usuariosAnteriores) =>
                usuariosAnteriores.filter(
                    (usuario) =>
                        usuario.id !== vendedorSelecionado
                )
            );

            setModalAberto(false);

            setTimeout(() => {
                irParaSucessoExcluir();
            }, 500);

        } catch (error) {

            console.error(
                "Erro ao excluir:",
                error
            );

            alert(
                error.message ||
                "Erro ao excluir usuário."
            );

            setModalAberto(false);

        }

    }

    return (

        <div className="pagina-listar">

            <div className="home-listar">

                <aside className="sidebar-listar">

                    <div>

                        <div className="logo-area">
                            <h1 className="logo-listar">
                                NanaNeném
                            </h1>
                        </div>

                        <nav className="menu-listar">

                            <button
                                className="dashboard"
                                onClick={voltar}
                            >
                                Dashboard
                            </button>

                            <button className="produtos">
                                Produtos
                            </button>

                            <button className="pedidos">
                                Pedidos
                            </button>

                            <button className="estoque">
                                Sem Estoque
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

                <main className="conteudo-listar">

                    <section className="topo-listar">

                        <div className="topo-textos">

                            <h1>
                                Excluir Vendedor
                            </h1>

                            <p>
                                Exclua vendedores cadastrados
                            </p>

                        </div>

                        <div className="topo-direita">

                            <div
                                className="perfil"
                                onClick={irParaEditar}
                            ></div>

                        </div>

                    </section>

                    <div className="titulo-listagem">
                        Excluir Vendedores
                    </div>

                    <section className="tabela-listar">

                        <h2>
                            Vendedores do Sistema
                        </h2>

                        <table>

                            <thead>

                            <tr>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Excluir</th>
                            </tr>

                            </thead>

                            <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="3"
                                        style={{
                                            textAlign: "center",
                                            padding: "20px"
                                        }}
                                    >
                                        Carregando vendedores...
                                    </td>

                                </tr>

                            ) : usuarios.length > 0 ? (

                                usuarios.map((usuario) => {

                                    console.log(usuario);

                                    return (

                                        <tr key={usuario.id}>

                                            <td>
                                                {usuario.nome}
                                            </td>

                                            <td>
                                                {usuario.email}
                                            </td>

                                            <td>

                                                <button
                                                    className="btn-excluir"
                                                    onClick={() =>
                                                        abrirModal(usuario.id)
                                                    }
                                                >
                                                    Excluir
                                                </button>

                                            </td>

                                        </tr>

                                    );

                                })

                            ) : (

                                <tr>

                                    <td
                                        colSpan="3"
                                        style={{
                                            textAlign: "center",
                                            padding: "20px"
                                        }}
                                    >
                                        Nenhum vendedor encontrado
                                    </td>

                                </tr>

                            )}

                            </tbody>

                        </table>

                    </section>

                </main>

            </div>

            {modalAberto && (

                <div className="overlay-modal">

                    <div className="modal-excluir">

                        <h2>
                            Excluir vendedor
                        </h2>

                        <p>
                            Deseja realmente excluir este vendedor?
                        </p>

                        <div className="botoes-modal">

                            <button
                                className="btn-nao"
                                onClick={() =>
                                    setModalAberto(false)
                                }
                            >
                                Não
                            </button>

                            <button
                                className="btn-sim"
                                onClick={confirmarExclusao}
                            >
                                Sim
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}

export default ExcluirVendedor;