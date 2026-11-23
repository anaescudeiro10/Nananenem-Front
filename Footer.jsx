import React from "react";
import "./Footer.css";

export default function Footer() {
    return (
        <footer className="footer">

            <div className="footer-content">

                <div className="footer-brand">
                    <h2>Nana<span>Neném</span></h2>

                    <p>
                        Produtos para bebês com conforto,
                        carinho e qualidade.
                    </p>
                </div>

                <div className="footer-info">

                    <div className="footer-item">
                        <h4>Contato</h4>
                        <p>(14) 9 9999-9999</p>
                        <p>contato@nananenem.com</p>
                    </div>

                    <div className="footer-item">
                        <h4>Localização</h4>
                        <p>São Manuel - SP</p>
                        <p>Entrega para todo Brasil</p>
                    </div>

                </div>

            </div>

            <div className="footer-bottom">
                © 2026 NanaNeném • Todos os direitos reservados
            </div>

        </footer>
    );
}