import React, { useEffect, useState } from "react";
import "./NovoPedido.css";

export default function NovoPedidoConteudo({ voltar }) {

    const [produtos, setProdutos] = useState([]);
    const [itens, setItens] = useState([]);
    const [produtoSelecionado, setProdutoSelecionado] = useState("");
    const [quantidade, setQuantidade] = useState(1);
    const [cliente, setCliente] = useState("");

    useEffect(() => {
        fetch("http://localhost:5000/produtos")
            .then(res => res.json())
            .then(data => setProdutos(data))
            .catch(() => setProdutos([]));
    }, []);

    const adicionarItem = () => {
        const produto = produtos.find(p => p.id == produtoSelecionado);
        if (!produto) return;

        const existe = itens.find(i => i.id === produto.id);

        if (existe) {
            setItens(itens.map(i =>
                i.id === produto.id
                    ? { ...i, quantidade: i.quantidade + Number(quantidade) }
                    : i
            ));
        } else {
            setItens([...itens, { ...produto, quantidade: Number(quantidade) }]);
        }
    };

    const removerItem = (id) => {
        setItens(itens.filter(i => i.id !== id));
    };

    const alterarQuantidade = (id, qtd) => {
        setItens(itens.map(i =>
            i.id === id ? { ...i, quantidade: Number(qtd) } : i
        ));
    };

    const total = itens.reduce(
        (acc, item) => acc + item.preco * item.quantidade,
        0
    );

    const salvarPedido = () => {
        const pedido = {
            cliente,
            itens,
            total,
            status: "criado",
            data: new Date()
        };

        fetch("http://localhost:5000/pedidos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pedido)
        })
            .then(() => {
                alert("Pedido criado!");
                voltar();
            });
    };

    return (
        <>
            {/* FORM */}
            <div className="form-pedido">

                <input
                    type="text"
                    placeholder="Nome do cliente"
                    value={cliente}
                    onChange={(e) => setCliente(e.target.value)}
                />

                <div className="linha-produto">
                    <select onChange={(e) => setProdutoSelecionado(e.target.value)}>
                        <option value="">Selecione um produto</option>
                        {produtos.map(p => (
                            <option key={p.id} value={p.id}>
                                {p.nome} - R$ {p.preco}
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        min="1"
                        value={quantidade}
                        onChange={(e) => setQuantidade(e.target.value)}
                    />

                    <button className="btn-add" onClick={adicionarItem}>
                        Adicionar
                    </button>
                </div>

            </div>

            {/* TABELA (SEU PADRÃO) */}
            <div className="tabela-vendedor">
                <h2>Itens do Pedido</h2>

                <table>
                    <thead>
                    <tr>
                        <th>Produto</th>
                        <th>Preço</th>
                        <th>Qtd</th>
                        <th>Subtotal</th>
                        <th>Ação</th>
                    </tr>
                    </thead>

                    <tbody>
                    {itens.map(item => (
                        <tr key={item.id}>
                            <td>{item.nome}</td>
                            <td>R$ {item.preco}</td>

                            <td>
                                <input
                                    type="number"
                                    value={item.quantidade}
                                    onChange={(e) =>
                                        alterarQuantidade(item.id, e.target.value)
                                    }
                                />
                            </td>

                            <td>
                                R$ {(item.preco * item.quantidade).toFixed(2)}
                            </td>

                            <td>
                                <button className="btn-remover"
                                        onClick={() => removerItem(item.id)}>
                                    Remover
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* TOTAL */}
            <div className="resumo">
                Total: R$ {total.toFixed(2)}
            </div>

            {/* BOTÕES */}
            <div className="acoes">
                <button onClick={voltar}>Cancelar</button>
                <button className="salvar" onClick={salvarPedido}>
                    Salvar Pedido
                </button>
            </div>
        </>
    );
}