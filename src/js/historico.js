const historicoBody = document.getElementById("historico-body");

let transacoes = [];

function carregarDados() {
    const dados = localStorage.getItem("transacoes");
    if(dados) {
        transacoes = JSON.parse(dados);
    }
}

function atualizarTabela() {
    historicoBody.innerHTML = "";
    transacoes.forEach(function(transacao){

        historicoBody.innerHTML += `
            <tr>
                <td>${transacao.descricao}</td>
                <td>R$ ${transacao.valor.toFixed(2)}</td>
                <td>${transacao.tipo}</td>
                <td>${transacao.categoria}</td>
                <td>${transacao.data}</td>
            </tr>
        `;
    });
}

carregarDados();
atualizarTabela();