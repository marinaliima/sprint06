// =========================================================================
// SELEÇÃO DE ELEMENTOS DA TELA
// =========================================================================
const lista = document.querySelector("#lista");
const aviso = document.querySelector("#aviso");

const form = document.querySelector("#form") || document.querySelector("#formulario");

// =========================================================================
// BUSCAR MENSAGENS E LISTAR NO MEIO DA TELA
// =========================================================================
async function carregarMensagens() {
    try {
        const resposta = await fetch("/mensagens");
        if (!resposta.ok) throw new Error("Falha ao carregar mensagens");
    
        const mensagens = await resposta.json();

        lista.replaceChildren();

        if (mensagens.length === 0) {
            const itemVazio = document.createElement("li");
            itemVazio.textContent = "Nenhuma mensagem enviada ainda. Seja o primeiro!";
            itemVazio.style.textAlign = "center";
            itemVazio.style.color = "#888";
            lista.append(itemVazio);
            return;
        }

        for (const mensagem of mensagens) {
            const item = document.createElement("li");

            const autor = document.createElement("strong");
            autor.textContent = mensagem.usuario + ": ";

            const texto = document.createTextNode(mensagem.texto);

            item.append(autor, texto);

            lista.append(item);
        }
    } catch (erro) {
        aviso.textContent = erro.message;
    }
}

// =========================================================================
// ENVIO DO FORMULÁRIO PARA O SERVIDOR
// =========================================================================
form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    try {
        const campoUsuario = document.querySelector("#usuario");
        const campoTexto = document.querySelector("#texto");

        const usuario = campoUsuario.value;
        const texto = campoTexto.value;

        const resposta = await fetch("/mensagens", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario, texto })
        });

        const dados = await resposta.json();
        if (!resposta.ok) throw new Error(dados.erro ?? "Erro ao enviar");

        campoTexto.value = "";
        aviso.textContent = "Mensagem enviada com sucesso!";

        await carregarMensagens();
    } catch (erro) {
        aviso.textContent = erro.message;
    }
});

carregarMensagens();

setInterval(carregarMensagens, 3000);