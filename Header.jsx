import React, { useState } from "react";
import "./Header.css";

export default function Header({ onBusca, buscaValor }) {
    const [busca, setBusca] = useState(buscaValor || "");

    const handleBuscaChange = (e) => {
        const valor = e.target.value;
        setBusca(valor);
        if (onBusca) {
            onBusca(valor);
        }
    };

    return (
        <header className="header">
            <div className="header-left">
                <h1>Vendedor logado</h1>
                <p>Página do Vendedor</p>
            </div>
            <div className="header-right">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={busca}
                        onChange={handleBuscaChange}
                    />
                    <span className="search-icon">🔍</span>
                </div>
                <button className="btn-sair-header">Sair</button>
                <div className="user-avatar"></div>
            </div>
        </header>
    );
}