import React from "react";
import "./CadastroSucesso.css";
import Footer from "../Components/Footer";

export default function CadastroSucesso({ voltar }) {
    return (
        <div className="pagina-sucesso">

            <div className="conteudo-sucesso">

                <div className="box-sucesso">

                    <div className="icone-sucesso">✅</div>

                    <h1>Cadastro realizado!</h1>

                    <p>
                        O vendedor foi cadastrado com sucesso no sistema.
                    </p>

                    <button
                        className="btn-voltar-home"
                        onClick={voltar}
                    >
                        Voltar para o Dashboard
                    </button>

                </div>

            </div>

            {/* 🔥 FOOTER */}
            <Footer />

        </div>
    );
}