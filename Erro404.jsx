import React from "react";
import "./Erro404.css";
import Footer from "../Components/Footer";

function Erro404({ voltarInicio }) {

    return (

        <div className="erro-page">

            <div className="erro-container">

                <div className="erro-card">


                    <h1>Página de Erro</h1>

                    <h2>Página não encontrada</h2>

                    <p>
                        A página que você tentou acessar não existe.
                    </p>



                </div>

            </div>

            <Footer />

        </div>

    );
}

export default Erro404;