import React, { useEffect, useMemo, useState } from "react";
import "./Produtos.css";
import Footer from "../Components/Footer";

const baseURL = "http://localhost:5000";

const LINHA_VAZIA = { cor: "", tamanho: "", estoque: "" };

// Lê a mensagem de erro do back-end (JSON ou texto) sem quebrar
async function lerErro(response, padrao) {
    try {
        const texto = await response.text();
        try {
            const json = JSON.parse(texto);
            return json.erro || json.message || padrao;
        } catch {
            // Se vier HTML (página de erro do servidor), usa a mensagem padrão
            return texto && !texto.trim().startsWith("<") ? texto : padrao;
        }
    } catch {
        return padrao;
    }
}

// Aceita caminho relativo ou URL completa vinda do back-end
function urlImagem(imagem) {
    if (!imagem) return null;
    if (/^(https?:|data:|blob:)/i.test(imagem)) return imagem;
    return `${baseURL}${imagem.startsWith("/") ? "" : "/"}${imagem}`;
}

function formatarPreco(preco) {
    const numero = Number(String(preco).replace(",", "."));
    if (Number.isNaN(numero)) return preco;
    return numero.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

export default function Produtos({
                                     voltar,
                                     sair,
                                     irParaEditar,
                                     irParaListarVendedor
                                 }) {

    const [produtos, setProdutos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erroLista, setErroLista] = useState("");
    const [busca, setBusca] = useState("");

    const [modal, setModal] = useState(false);
    const [editando, setEditando] = useState(null);
    const [salvando, setSalvando] = useState(false);
    const [erroForm, setErroForm] = useState("");

    const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
    const [produtoExcluir, setProdutoExcluir] = useState(null);
    const [excluindo, setExcluindo] = useState(false);

    const [form, setForm] = useState({
        nome: "",
        descricao: "",
        preco: "",
        imagem: null
    });

    const [grade, setGrade] = useState([{ ...LINHA_VAZIA }]);

    useEffect(() => {
        carregarProdutos();
    }, []);

    async function carregarProdutos() {
        try {
            setErroLista("");

            const response = await fetch(`${baseURL}/produtos`);

            if (!response.ok) {
                throw new Error(
                    await lerErro(response, "Erro ao carregar os produtos.")
                );
            }

            const data = await response.json();

            // Evita quebrar o .map caso o back-end devolva algo que não seja lista
            setProdutos(Array.isArray(data) ? data : []);

        } catch (error) {
            console.error(error);
            setErroLista(
                "Não foi possível carregar os produtos. Verifique se o servidor está ligado."
            );
        } finally {
            setCarregando(false);
        }
    }

    // Filtro da barra de busca
    const produtosFiltrados = useMemo(() => {
        const termo = busca.trim().toLowerCase();
        if (!termo) return produtos;

        return produtos.filter((p) =>
            `${p.nome || ""} ${p.descricao || ""}`
                .toLowerCase()
                .includes(termo)
        );
    }, [produtos, busca]);

    /* ---------- GRADE ---------- */

    function adicionarLinhaGrade() {
        setGrade((atual) => [...atual, { ...LINHA_VAZIA }]);
    }

    function removerLinhaGrade(index) {
        setGrade((atual) =>
            atual.length === 1
                ? [{ ...LINHA_VAZIA }]
                : atual.filter((_, i) => i !== index)
        );
    }

    // Não altera o estado original diretamente
    function atualizarGrade(index, campo, valor) {
        setGrade((atual) =>
            atual.map((linha, i) =>
                i === index ? { ...linha, [campo]: valor } : linha
            )
        );
    }

    /* ---------- MODAL ---------- */

    function abrirNovoProduto() {
        setEditando(null);
        setErroForm("");

        setForm({
            nome: "",
            descricao: "",
            preco: "",
            imagem: null
        });

        setGrade([{ ...LINHA_VAZIA }]);
        setModal(true);
    }

    function abrirEditar(produto) {
        setEditando(produto);
        setErroForm("");

        setForm({
            nome: produto.nome || "",
            descricao: produto.descricao || "",
            preco:
                produto.preco !== undefined && produto.preco !== null
                    ? String(produto.preco).replace(".", ",")
                    : "",
            imagem: null
        });

        setGrade(
            produto.grade?.length
                ? produto.grade.map((g) => ({
                    cor: g.cor ?? "",
                    tamanho: g.tamanho ?? "",
                    estoque: g.estoque ?? ""
                }))
                : [{ ...LINHA_VAZIA }]
        );

        setModal(true);
    }

    function fecharModal() {
        if (salvando) return;
        setModal(false);
        setErroForm("");
    }

    /* ---------- SALVAR ---------- */

    function validar(gradeLimpa, precoNumero) {

        if (!form.nome.trim()) {
            return "Informe o nome do produto.";
        }

        if (Number.isNaN(precoNumero) || precoNumero <= 0) {
            return "Informe um preço válido, maior que zero.";
        }

        if (gradeLimpa.length === 0) {
            return "Cadastre pelo menos uma linha na grade (cor, tamanho e estoque).";
        }

        for (const linha of gradeLimpa) {

            if (!String(linha.cor).trim() || !String(linha.tamanho).trim()) {
                return "Preencha cor e tamanho em todas as linhas da grade.";
            }

            const estoque = Number(linha.estoque);

            if (
                String(linha.estoque).trim() === "" ||
                !Number.isInteger(estoque) ||
                estoque < 0
            ) {
                return "O estoque deve ser um número inteiro maior ou igual a zero.";
            }
        }

        return "";
    }

    async function salvar() {

        if (salvando) return;

        // Ignora linhas totalmente vazias
        const gradeLimpa = grade.filter(
            (g) =>
                String(g.cor).trim() ||
                String(g.tamanho).trim() ||
                String(g.estoque).trim()
        );

        const precoNumero = Number(
            String(form.preco).trim().replace(",", ".")
        );

        const mensagemErro = validar(gradeLimpa, precoNumero);

        if (mensagemErro) {
            setErroForm(mensagemErro);
            return;
        }

        try {

            setSalvando(true);
            setErroForm("");

            const formData = new FormData();

            formData.append("nome", form.nome.trim());
            formData.append("descricao", form.descricao.trim());
            formData.append("preco", precoNumero);

            if (form.imagem) {
                formData.append("imagem", form.imagem);
            }

            formData.append(
                "grade",
                JSON.stringify(
                    gradeLimpa.map((g) => ({
                        cor: String(g.cor).trim(),
                        tamanho: String(g.tamanho).trim(),
                        estoque: Number(g.estoque)
                    }))
                )
            );

            const url = editando
                ? `${baseURL}/produtos/${editando.id_produto}`
                : `${baseURL}/produtos`;

            const response = await fetch(url, {
                method: editando ? "PUT" : "POST",
                body: formData
            });

            if (!response.ok) {
                throw new Error(
                    await lerErro(response, "Erro ao salvar o produto.")
                );
            }

            setModal(false);
            await carregarProdutos();

        } catch (error) {
            console.error(error);
            setErroForm(error.message || "Erro ao salvar o produto.");
        } finally {
            setSalvando(false);
        }
    }

    /* ---------- EXCLUIR ---------- */

    function excluir(id) {
        setProdutoExcluir(id);
        setMostrarConfirmacao(true);
    }

    function cancelarExclusao() {
        if (excluindo) return;
        setMostrarConfirmacao(false);
        setProdutoExcluir(null);
    }

    async function confirmarExclusao() {

        if (produtoExcluir === null || excluindo) return;

        try {

            setExcluindo(true);

            const response = await fetch(
                `${baseURL}/produtos/${produtoExcluir}`,
                { method: "DELETE" }
            );

            if (!response.ok) {
                throw new Error(
                    await lerErro(response, "Erro ao excluir o produto.")
                );
            }

            setMostrarConfirmacao(false);
            setProdutoExcluir(null);

            await carregarProdutos();

        } catch (error) {
            console.error(error);
            alert(error.message || "Erro ao excluir o produto.");
        } finally {
            setExcluindo(false);
        }
    }

    /* ---------- TELA ---------- */

    return (
        <div className="pagina-produtos">

            <div className="home-produtos">

                <aside className="sidebar-produtos">

                    <div>

                        <h1 className="logo-produtos">
                            NanaNeném
                        </h1>

                        <nav className="menu-produtos">

                            <button
                                className="dashboard"
                                onClick={voltar}
                            >
                                Dashboard
                            </button>

                            <button className="produtos ativo">
                                Produtos
                            </button>

                            <button className="clientes">
                                Clientes
                            </button>

                            <button className="pedidos">
                                Pedidos
                            </button>

                            <button
                                className="usuarios"
                                onClick={irParaListarVendedor}
                            >
                                Usuários
                            </button>

                            <button className="financeiro">
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

                <main className="conteudo-produtos">

                    <section className="topo-produtos">

                        <div className="topo-textos">
                            <h1>Produtos</h1>
                            <p>
                                Gerencie os produtos da loja
                            </p>
                        </div>

                        <div className="topo-direita">

                            <div className="buscar">
                                <input
                                    placeholder="Buscar produto..."
                                    value={busca}
                                    onChange={(e) =>
                                        setBusca(e.target.value)
                                    }
                                />
                            </div>

                            <div
                                className="perfil"
                                onClick={irParaEditar}
                            ></div>

                        </div>

                    </section>

                    <div className="topo-acoes">

                        <button
                            className="btn-adicionar"
                            onClick={abrirNovoProduto}
                        >
                            + Novo Produto
                        </button>

                    </div>

                    <div className="titulo-produtos">
                        Produtos Cadastrados
                    </div>

                    {carregando && (
                        <p className="mensagem-lista">
                            Carregando produtos...
                        </p>
                    )}

                    {!carregando && erroLista && (
                        <p className="mensagem-lista erro">
                            {erroLista}
                        </p>
                    )}

                    {!carregando && !erroLista && produtosFiltrados.length === 0 && (
                        <p className="mensagem-lista">
                            {busca.trim()
                                ? "Nenhum produto encontrado para a busca."
                                : "Nenhum produto cadastrado ainda."}
                        </p>
                    )}

                    <section className="grid-produtos">

                        {produtosFiltrados.map((produto) => {

                            const imagem = urlImagem(produto.imagem);

                            return (

                                <div
                                    className="card-produto"
                                    key={produto.id_produto}
                                >

                                    {imagem && (
                                        <img
                                            src={imagem}
                                            alt={produto.nome}
                                            onError={(e) => {
                                                e.currentTarget.style.visibility = "hidden";
                                            }}
                                        />
                                    )}

                                    <div className="card-body">

                                        <h3>{produto.nome}</h3>

                                        {produto.tamanho && <h4>{produto.tamanho}</h4>}

                                        <p>{produto.descricao}</p>

                                        {produto.cor && <h4>{produto.cor}</h4>}

                                        <span className="preco">
                                            R$ {formatarPreco(produto.preco)}
                                        </span>

                                        <div className="grade-card">

                                            {produto.grade?.length > 0 ? (

                                                produto.grade.map((item, index) => (

                                                    <div
                                                        className="item-grade"
                                                        key={item.id_grade ?? item.id ?? index}
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

                                        <div className="acoes">

                                            <button
                                                className="btn-editar"
                                                onClick={() => abrirEditar(produto)}
                                            >
                                                Editar
                                            </button>

                                            <button
                                                className="btn-excluir"
                                                onClick={() => excluir(produto.id_produto)}
                                            >
                                                Excluir
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            );
                        })}

                    </section>

                </main>

            </div>

            {modal && (

                <div className="modal">

                    <div className="modal-box">

                        <h2>
                            {editando
                                ? "Editar Produto"
                                : "Novo Produto"}
                        </h2>

                        {erroForm && (
                            <div className="erro-modal">
                                {erroForm}
                            </div>
                        )}

                        <input
                            placeholder="Nome"
                            value={form.nome}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    nome: e.target.value
                                })
                            }
                        />

                        <input
                            placeholder="Descrição"
                            value={form.descricao}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    descricao: e.target.value
                                })
                            }
                        />

                        <input
                            placeholder="Preço (ex: 49,90)"
                            inputMode="decimal"
                            value={form.preco}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    // só números, vírgula e ponto
                                    preco: e.target.value.replace(/[^0-9.,]/g, "")
                                })
                            }
                        />

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    imagem: e.target.files[0] || null
                                })
                            }
                        />

                        <h3>Grade</h3>

                        {grade.map((g, i) => (

                            <div
                                key={i}
                                className="linha-grade"
                            >

                                <input
                                    placeholder="Cor"
                                    value={g.cor}
                                    onChange={(e) =>
                                        atualizarGrade(i, "cor", e.target.value)
                                    }
                                />

                                <input
                                    placeholder="Tamanho"
                                    value={g.tamanho}
                                    onChange={(e) =>
                                        atualizarGrade(i, "tamanho", e.target.value)
                                    }
                                />

                                <input
                                    placeholder="Estoque"
                                    inputMode="numeric"
                                    value={g.estoque}
                                    onChange={(e) =>
                                        atualizarGrade(
                                            i,
                                            "estoque",
                                            e.target.value.replace(/\D/g, "")
                                        )
                                    }
                                />

                                {grade.length > 1 && (
                                    <button
                                        type="button"
                                        className="btn-remover-grade"
                                        onClick={() => removerLinhaGrade(i)}
                                        title="Remover linha"
                                    >
                                        ✕
                                    </button>
                                )}

                            </div>

                        ))}

                        <div className="modal-botoes">

                            <button
                                className="btn-adicionar"
                                onClick={adicionarLinhaGrade}
                                disabled={salvando}
                            >
                                + Adicionar Linha
                            </button>

                            <button
                                className="btn-salvar"
                                onClick={salvar}
                                disabled={salvando}
                            >
                                {salvando ? "Salvando..." : "Salvar"}
                            </button>

                            <button
                                className="btn-cancelar"
                                onClick={fecharModal}
                                disabled={salvando}
                            >
                                Cancelar
                            </button>

                        </div>

                    </div>

                </div>

            )}

            {mostrarConfirmacao && (

                <div className="modal-confirmacao">

                    <div className="box-confirmacao">

                        <div className="icone-excluir">

                        </div>

                        <h2>
                            Excluir Produto
                        </h2>

                        <p>
                            Tem certeza que deseja excluir este produto?
                            Essa ação não poderá ser desfeita.
                        </p>

                        <div className="acoes-confirmacao">

                            <button
                                className="btn-cancelar-exclusao"
                                onClick={cancelarExclusao}
                                disabled={excluindo}
                            >
                                Cancelar
                            </button>

                            <button
                                className="btn-confirmar-excluir"
                                onClick={confirmarExclusao}
                                disabled={excluindo}
                            >
                                {excluindo ? "Excluindo..." : "Sim, Excluir"}
                            </button>

                        </div>

                    </div>

                </div>

            )}

            <Footer />

        </div>
    );
}