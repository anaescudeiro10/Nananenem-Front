import { useState } from "react";
import "./ConfirmarCodigo.css";

function ConfirmarCodigo({ email, novaSenha, voltarLogin }) {

    const [codigo, setCodigo] = useState("");
    const [mensagem, setMensagem] = useState("");

    const handleConfirmar = async () => {

        if (!codigo) {
            setMensagem("Digite o código.");
            return;
        }

        try {
            const res = await fetch("http://10.92.3.169:5000/solicitar_recuperacao", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    email,
                    codigo,
                    nova_senha: novaSenha
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setMensagem(" Senha alterada com sucesso!");

                setTimeout(() => {
                    voltarLogin();
                }, 2000);

            } else {
                setMensagem(data.erro);
            }

        } catch {
            setMensagem("Erro ao conectar.");
        }
    };

    return (
        <div className="container">
            <div className="box">

                <h2>Confirmar Código</h2>

                <input
                    type="text"
                    placeholder="Código de 6 dígitos"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                />

                <p
                    className="voltar"
                    onClick={() => {
                        console.log("voltando"); // só pra testar
                        voltarLogin && voltarLogin();
                    }}
                >
                    Voltar para login
                </p>

                {mensagem && <p className="msg">{mensagem}</p>}

            </div>
        </div>
    );
}

export default ConfirmarCodigo;