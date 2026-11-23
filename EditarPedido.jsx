import React, { useState } from "react";

export default function EditarPedido({ pedido, voltar }) {

    const [quantidade, setQuantidade] = useState(pedido.quantidade);

    const salvar = async () => {

        await fetch(`http://localhost:5000/editar_pedido/${pedido.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantidade })
        });

        voltar();
    };

    return (
        <div>

            <h1>Editar Pedido #{pedido.id}</h1>

            <input
                type="number"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
            />

            <button onClick={salvar}>
                Salvar
            </button>

        </div>
    );
}