import { useEffect, useState } from "react";

import Login from "./pages/Login";
import Cadastrar from "./pages/Cadastrar";
import ConfirmarEmail from "./pages/ConfirmarEmail";

import HomeVendedor from "./pages/HomeVendedor";
import HomeAdmin from "./pages/HomeAdmin";

import ListarVendedor from "./pages/ListarVendedor";
import AdicionarVendedor from "./pages/AdicionarVendedor";
import ExcluirVendedor from "./pages/ExcluirVendedor";

import CadastroSucesso from "./pages/CadastroSucesso";
import ExcluidoSucesso from "./pages/ExcluidoSucesso";

import EditarUsuario from "./pages/EditarUsuario";
import EsqueciSenha from "./pages/EsqueciSenha";
import Erro404 from "./pages/Erro404";

import Produtos from "./pages/Produtos";
import ProdutosVendedor from "./pages/ProdutosVendedor";

import PedidosVendedor from "./pages/PedidosVendedor";
import NovoPedido from "./pages/NovoPedido";
import DetalhePedido from "./pages/DetalhePedido";
import EditarPedido from "./pages/EditarPedido";

function App() {

    const [tela, setTela] = useState("login");
    const [email, setEmail] = useState("");
    const [idUsuario, setIdUsuario] = useState(null);

    const sair = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("tipo");
        localStorage.removeItem("id_usuario");

        setTela("login");
    };

    useEffect(() => {

        const id = localStorage.getItem("id_usuario");

        if (id) {
            setIdUsuario(Number(id));
        }

    }, []);

    return (
        <>
            {tela === "login" && (
                <Login
                    irParaCadastro={() => setTela("cadastro")}
                    irParaHome={(tipo, id) => {

                        if (id) {
                            localStorage.setItem(
                                "id_usuario",
                                id
                            );

                            setIdUsuario(Number(id));
                        }

                        if (
                            tipo?.toLowerCase() === "admin"
                        ) {
                            setTela("admin");
                        } else {
                            setTela("home");
                        }
                    }}
                    irParaRecuperacao={(emailDigitado) => {

                        setEmail(emailDigitado);

                        setTela("recuperar");
                    }}
                />
            )}

            {tela === "cadastro" && (
                <Cadastrar
                    voltar={() => setTela("login")}
                    irParaConfirmacao={(
                        emailRecebido,
                        id
                    ) => {

                        setEmail(emailRecebido);

                        setIdUsuario(Number(id));

                        localStorage.setItem(
                            "id_usuario",
                            id
                        );

                        setTela("confirmar");
                    }}
                />
            )}

            {tela === "confirmar" && (
                <ConfirmarEmail
                    email={email}
                    id_usuario={idUsuario}
                    onConfirmado={() =>
                        setTela("login")
                    }
                />
            )}

            {tela === "recuperar" && (
                <EsqueciSenha
                    voltarLogin={() =>
                        setTela("login")
                    }
                />
            )}

            {tela === "home" && (
                <HomeVendedor
                    sair={sair}
                    irParaEditar={() => setTela("editar")}
                    irParaProdutos={() => setTela("produtosVendedor")}
                    irParaPedidos={() => setTela("pedidos")} // 👈 ESSENCIAL
                />
            )}

            {tela === "produtosVendedor" && (
                <ProdutosVendedor
                    voltar={() => setTela("home")}
                />
            )}


            {tela === "admin" && (
                <HomeAdmin
                    sair={sair}
                    irParaEditar={() =>
                        setTela("editar")
                    }
                    irParaListarVendedor={() =>
                        setTela("listarVendedor")
                    }
                    irParaAdicionarVendedor={() =>
                        setTela("adicionarVendedor")
                    }
                    irParaExcluirVendedor={() =>
                        setTela("excluirVendedor")
                    }
                    irParaProdutos={() =>
                        setTela("produtos")
                    }
                />
            )}

            {tela === "listarVendedor" && (
                <ListarVendedor
                    voltar={() => setTela("admin")}
                    sair={sair}
                    irParaEditar={() => setTela("editar")}
                    irParaAdicionarVendedor={() => setTela("adicionarVendedor")}
                    irParaExcluirVendedor={() => setTela("excluirVendedor")}
                />
            )}



            {tela === "adicionarVendedor" && (
                <AdicionarVendedor
                    voltar={() => setTela("listarVendedor")}
                    sair={sair}
                    irParaEditar={() => setTela("editar")}
                    onCadastroSucesso={() => setTela("cadastroSucesso")} // 🔥 ESSENCIAL
                />
            )}

            {tela === "excluirVendedor" && (
                <ExcluirVendedor
                    voltar={() =>
                        setTela("listarVendedor")
                    }
                />
            )}

            {tela === "cadastroSucesso" && (
                <CadastroSucesso
                    voltar={() =>
                        setTela("admin")
                    }
                />
            )}

            {tela === "excluidoSucesso" && (
                <ExcluidoSucesso
                    voltar={() =>
                        setTela("admin")
                    }
                />
            )}

            {tela === "pedidos" && (
                <PedidosVendedor
                    irParaNovo={() => setTela("novoPedido")}
                    irParaDetalhe={(p) => {
                        setPedidoSelecionado(p);
                        setTela("detalhePedido");
                    }}
                />
            )}


            {tela === "novoPedido" && (
                <NovoPedido voltar={() => setTela("pedidos")} />
            )}

            {tela === "detalhePedido" && (
                <DetalhePedido
                    pedido={pedidoSelecionado}
                    voltar={() => setTela("pedidos")}
                    irParaEditar={() => setTela("editarPedido")}
                />
            )}

            {tela === "editarPedido" && (
                <EditarPedido
                    pedido={pedidoSelecionado}
                    voltar={() => setTela("pedidos")}
                />
            )}



            {tela === "produtos" && (
                <Produtos
                    voltar={() =>
                        setTela("admin")
                    }
                />
            )}


            {tela === "editar" && (
                <EditarUsuario
                    usuarioLogado={idUsuario}
                    voltar={() => {

                        const tipo =
                            localStorage.getItem(
                                "tipo"
                            );

                        if (
                            tipo?.toLowerCase() ===
                            "admin"
                        ) {
                            setTela("admin");
                        } else {
                            setTela("home");
                        }
                    }}
                />
            )}

            {![
                "login",
                "cadastro",
                "confirmar",
                "recuperar",
                "home",
                "admin",
                "listarVendedor",
                "adicionarVendedor",
                "excluirVendedor",
                "cadastroSucesso",
                "excluidoSucesso",
                "produtos",
                "produtosVendedor",
                "editar",
                "pedidos",
                "novoPedido",
                "detalhePedido",
                "editarPedido",
            ].includes(tela) && (
                <Erro404 />
            )}
        </>
    );
}

export default App;