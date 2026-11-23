import React from "react";

export default function DetalhePedido({ pedido, voltar, irParaEditar }) {

    if (!pedido) return null;

    const finalizarPedido = async () => {
        await fetch(`http://localhost:5000/finalizar_pedido/${pedido.id}`, {
            method: "PUT"
        });

        voltar();
    };

    return (
        <div>

            <h1>Pedido #{pedido.id}</h1>

            <p>Cliente: {pedido.cliente}</p>
            <p>Total: R$ {pedido.total}</p>
            <p>Status: {pedido.status}</p>

            <button onClick={irParaEditar}>
                Editar
            </button>

            <button onClick={finalizarPedido}>
                Finalizar Pedido
            </button>

            <button onClick={voltar}>
                Voltar
            </button>

        </div>
    );
}