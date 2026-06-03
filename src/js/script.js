import {
    adicionarTransacao,
    limparTransacoes
} from "./transacoes.js";

import { atualizarCards } from "./dashboard.js";

import { pegarDataAtual } from "./utils.js";

document.getElementById("data-atual").innerText =
    pegarDataAtual();


// INPUTS
const descricao = document.getElementById("descricao");
const valor = document.getElementById("valor");
const tipo = document.getElementById("tipo");
const categoria = document.getElementById("categoria");
const data = document.getElementById("data");


// BOTÕES
const botao = document.getElementById("adicionar");
const lixo = document.getElementById("lixo");


// INICIALIZAÇÃO
atualizarCards();



// ADICIONAR TRANSAÇÃO
botao.addEventListener("click", function() {

    const transacao = {

        id: crypto.randomUUID(),  //id proprio

        descricao: descricao.value,

        valor: Number(valor.value),

        tipo: tipo.value,

        categoria: categoria.value,

        data: data.value,
    };


    if (
        descricao.value === "" ||
        valor.value === "" ||
        data.value === ""
    ) {
        alert("Preencha todos os campos.");

        return;
    }
    adicionarTransacao(transacao)

    atualizarCards();


    // LIMPAR CAMPOS
    descricao.value = "";

    valor.value = "";

    tipo.value = "entrada";

    categoria.value = "alimentacao";

    data.value = "";
});


// LIMPAR TODAS AS TRANSAÇÕES
lixo.addEventListener("click", function() {

    limparTransacoes();

    atualizarCards();
});