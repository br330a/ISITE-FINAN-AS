const historicoBody = document.getElementById("historico-body");
const pesquisa = document.getElementById("pesquisa");

let transacoes = [];

function carregarDados() {
    const dados = localStorage.getItem("transacoes");
    if(dados) {
        transacoes = JSON.parse(dados);
    }
}

function atualizarTabela(lista) {
    historicoBody.innerHTML = "";
    lista.forEach(function(transacao, index){

        historicoBody.innerHTML += `
            <tr>
                <td>${transacao.descricao}</td>
                <td>R$ ${transacao.valor.toFixed(2)}</td>
                <td class="${transacao.tipo}">${transacao.tipo}</td>
                <td>${transacao.categoria}</td>
                <td>${transacao.data}</td>

                <td>
                    <button class="btnExcluir" onclick="deletarTransacao(${index})">
                        🗑️
                    </button>
                </td>
            </tr>
        `;
    });
}


carregarDados();
atualizarTabela(transacoes);

function deletarTransacao(index) {
    transacoes.splice(index, 1);

    localStorage.setItem(
        "transacoes", 
        JSON.stringify(transacoes)
    );
    atualizarTabela();
}


pesquisa.addEventListener("input", function(){
    const texto = pesquisa.value.toLowerCase();
    const filtradas = transacoes.filter(function(transacao){
        return transacao.descricao
            .toLowerCase()
            .includes(texto);
    });
    atualizarTabela(filtradas);
})