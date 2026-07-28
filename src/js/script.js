import { atualizarCards } from "./dashboard.js";

import { pegarDataAtual } from "./utils.js";

import {
    verificarAutenticacao,
    logout
} from "./auth.js";

import { criarTransacao } from "./api.js";

import { mostrarToast } from "./toast.js";

verificarAutenticacao();

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

const botaoLogout =
    document.getElementById("logout");


const modalLogout =
    document.getElementById("modalConfirmacao");

const cancelarLogout =
    document.getElementById("cancelarLogout");

const confirmarLogout =
    document.getElementById("confirmarLogout"); 


// INICIALIZAÇÃO
atualizarCards();



// ADICIONAR TRANSAÇÃO
botao.addEventListener("click", async function() {

    const transacao = {

        id: crypto.randomUUID(),  //id proprio

        descricao: descricao.value,

        valor: Number(valor.value),

        tipo: tipo.value,

        categoria: categoria.value,

        data_transacao: data.value,
    };


    if (
        descricao.value === "" ||
        valor.value === "" ||
        data.value === ""
    ) {
        mostrarToast(
            "Preencha todos os campos.",
            "erro"
        );

        return;
    }
    try {

        await criarTransacao(transacao);

        atualizarCards();

        mostrarToast(
            "Transação cadastrada com sucesso!",
            "sucesso"
        );

    } catch (erro) {

        console.error(erro);

        mostrarToast(
            "Erro ao cadastrar transação.",
            "erro"
        );

        return;

    }


    // LIMPAR CAMPOS
    descricao.value = "";

    valor.value = "";

    tipo.value = "entrada";

    categoria.value = "alimentacao";

    data.value = "";
});

//botao logout
botaoLogout.addEventListener("click", function () {

    modalLogout.style.display = "flex";

});


cancelarLogout.addEventListener("click", function () {

    modalLogout.style.display = "none";

});

confirmarLogout.addEventListener("click", function () {

    logout();

});