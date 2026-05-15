const hoje = new Date();

document.getElementById("data-atual").innerText = hoje.toLocaleDateString("pt-BR")


const descricao = document.getElementById("descricao");
const valor = document.getElementById("valor");
const tipo = document.getElementById("tipo");
const categoria = document.getElementById("categoria");
const data = document.getElementById("data");
const botao = document.getElementById("adicionar");

const saldo = document.getElementById("saldo");
const entrada = document.getElementById("entrada");
const saida = document.getElementById("saida");

const lixo = document.getElementById("lixo");


let transacoes = [];

function salvarDados(){
    localStorage.setItem("transacoes", JSON.stringify(transacoes));
}

function carregarDados(){
    const dados = localStorage.getItem("transacoes");

    if(dados){
        transacoes = JSON.parse(dados);
    }
}

carregarDados();
atualizarCards();

function atualizarCards() {
    let totalEntrada = 0;
    let totalSaida = 0;

    transacoes.forEach(function(transacao){

        if(transacao.tipo === "entrada") {
            totalEntrada += transacao.valor;
        }

        else {
            totalSaida += transacao.valor;
        }
    });

    let saldoTotal = totalEntrada - totalSaida;

    saldo.innerText = `R$ ${saldoTotal.toFixed(2)}`;
    entrada.innerText = `R$ ${totalEntrada.toFixed(2)}`;
    saida.innerText = `R$ ${totalSaida.toFixed(2)}`;
}

botao.addEventListener("click", function() {
    const transacao = {
        descricao: descricao.value,
        valor: Number(valor.value),
        tipo: tipo.value,
        categoria: categoria.value,
        data: data.value,
    };

    transacoes.push(transacao);
    salvarDados();
    atualizarCards();
    console.log(transacoes);

    descricao.value = "";
    valor.value = "";
    tipo.value = "entrada";
    categoria.value = "alimentaçao";
    data.value = "";
})

lixo.addEventListener("click", function(){

    transacoes = [];

    localStorage.removeItem("transacoes");

    atualizarCards();

});


