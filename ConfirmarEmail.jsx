import React, { useState } from 'react';
import './ConfirmarEmail.css';

const ConfirmarEmail = ({ email, id_usuario, onConfirmado }) => {
    const [codigo, setCodigo] = useState('');
    const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
    const [carregando, setCarregando] = useState(false);


    const confirmarCodigo = async () => {

        if (!codigo || codigo.length !== 6) {

            setMensagem({
                tipo: 'erro',
                texto: 'Digite o código de 6 dígitos'
            });

            return;
        }

        setCarregando(true);

        setMensagem({
            tipo: '',
            texto: ''
        });

        try {

            console.log("ID USUARIO:", id_usuario);
            console.log("CODIGO:", codigo);

            const formData = new FormData();

            formData.append('id_usuario', id_usuario);
            formData.append('codigo', codigo);

            const response = await fetch(
                'http://127.0.0.1:5000/confirmar_codigo',
                {
                    method: 'POST',
                    body: formData
                }
            );

            console.log("STATUS:", response.status);

            const data = await response.json();

            console.log(data);

            if (response.ok) {

                setMensagem({
                    tipo: 'sucesso',
                    texto: 'Conta confirmada com sucesso!'
                });

                setTimeout(() => {

                    if (onConfirmado) {
                        onConfirmado();
                    }

                }, 2000);

            } else {

                setMensagem({
                    tipo: 'erro',
                    texto: data.erro || 'Código inválido'
                });

            }

        } catch (error) {

            console.log(error);

            setMensagem({
                tipo: 'erro',
                texto: 'Erro ao conectar com o servidor'
            });

        } finally {

            setCarregando(false);

        }
    };

    return (
        <div className="confirmar-page">
            <div className="background-image"></div>

            <div className="content-wrapper">

                <div className="logo-container">
                    <div className="logo-text">NanaNeném</div>
                </div>

                <div className="confirmar-card">
                    <h1 className="confirmar-title">Confirmar Email</h1>

                    <p className="confirmar-descricao">
                        Enviamos um código de verificação de 6 dígitos para:
                        <br />
                        <strong>{email}</strong>
                    </p>

                    <div className="input-group">
                        <label>Código de Verificação</label>
                        <input
                            type="text"
                            maxLength="6"
                            className="codigo-input"
                            value={codigo}
                            onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))}
                            placeholder="000000"
                            disabled={carregando}
                        />
                    </div>

                    <button
                        className="btn-confirmar"
                        onClick={confirmarCodigo}
                        disabled={carregando}
                    >
                        {carregando ? 'Verificando...' : 'Confirmar Código'}
                    </button>

                    <div className="links">
                        <div className="reenviar-link">
                            Não recebeu o código? <a href="#" onClick={(e) => {
                            e.preventDefault();
                        }}>Reenviar</a>
                        </div>
                    </div>

                    {mensagem.texto && (
                        <div className={`mensagem ${mensagem.tipo}`}>
                            {mensagem.texto}
                        </div>
                    )}
                </div>
            </div>

            <footer className="footer">
                <div className="footer-text">
                    <p>Copyright © 2026 NanaNeném</p>
                    <p>Política de Privacidade | Termos de uso</p>
                </div>
            </footer>
        </div>
    );
};

export default ConfirmarEmail;