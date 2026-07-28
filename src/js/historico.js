import {
    buscarTransacoes,
    excluirTransacao
} from "./api.js";

import {
    formatarMoeda,
    formatarData
} from "./utils.js";

import { mostrarToast } from "./toast.js";


// ELEMENTOS
const historicoBody = document.getElementById("historico-body");

const filtroTipo = document.getElementById("filtroTipo");

const filtroCategoria = document.getElementById("filtroCategoria");

const pesquisa = document.getElementById("pesquisa");

const dataInicial = document.getElementById("dataInicial");

const dataFinal = document.getElementById("dataFinal");

const modalExcluir =
    document.getElementById("modalExcluir");

const cancelarExcluir =
    document.getElementById("cancelarExcluir");

const confirmarExcluir =
    document.getElementById("confirmarExcluir");


// FORMATAR MÊS
function formatarMes(data) {

    const meses = [

        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"
    ];

    const partes = data.split("-");

    const ano = partes[0];

    const mes = Number(partes[1]) - 1;

    return `${meses[mes]} ${ano}`;
}


// CRIAR LINHA DO MÊS
function criarLinhaMes(mesAtual) {

    const linhaMes = document.createElement("tr");

    linhaMes.classList.add("linhaMes");


    const tdMes = document.createElement("td");

    tdMes.colSpan = 6;

    tdMes.innerText = mesAtual;


    linhaMes.appendChild(tdMes);

    return linhaMes;
}


// CRIAR LINHA DA TRANSAÇÃO
function criarLinhaTransacao(transacao) {

    const linha = document.createElement("tr");


    // DESCRIÇÃO
    const tdDescricao = document.createElement("td");

    tdDescricao.innerText = transacao.descricao;

    linha.appendChild(tdDescricao);


    // VALOR
    const tdValor = document.createElement("td");

    tdValor.innerText = formatarMoeda(transacao.valor);

    linha.appendChild(tdValor);


    // TIPO
    const tdTipo = document.createElement("td");

    tdTipo.innerText = transacao.tipo;

    tdTipo.classList.add(transacao.tipo);

    linha.appendChild(tdTipo);


    // CATEGORIA
    const tdCategoria = document.createElement("td");

    tdCategoria.innerText = transacao.categoria;

    linha.appendChild(tdCategoria);


    // DATA
    const tdData = document.createElement("td");

    tdData.innerText = formatarData(transacao.data);

    linha.appendChild(tdData);


    // BOTÃO EXCLUIR
    const tdBotao = document.createElement("td");

    if (transacao.tipo === "meta") {
        tdBotao.innerText = "-";
    } else {
        const botaoExcluir = document.createElement("button");

        botaoExcluir.innerText = "🗑️";

        botaoExcluir.classList.add("btnExcluir");

        botaoExcluir.dataset.id = transacao.id;

        tdBotao.appendChild(botaoExcluir);
    }

    linha.appendChild(tdBotao);


    return linha;
}


// ATUALIZAR TABELA
async function atualizarTabela() {

    const transacoes = await buscarTransacoes();

    historicoBody.innerHTML = "";


    // FILTROS
    const tipoSelecionado = filtroTipo.value;

    const categoriaSelecionada = filtroCategoria.value;

    const textoPesquisa = pesquisa.value.toLowerCase();

    const dataInicialValue = dataInicial.value;

    const dataFinalValue = dataFinal.value;


    // FILTRAR
    const transacoesFiltradas = transacoes.filter(function(transacao) {

        const filtroTipoOK =

            tipoSelecionado === "todos" ||

            transacao.tipo === tipoSelecionado;


        const filtroCategoriaOK =

            categoriaSelecionada === "todos" ||

            transacao.categoria === categoriaSelecionada;


        const filtroPesquisaOK =

            transacao.descricao
                .toLowerCase()
                .includes(textoPesquisa);


        const filtroDataInicialOK =

            !dataInicialValue ||

            transacao.data >= dataInicialValue;


        const filtroDataFinalOK =

            !dataFinalValue ||

            transacao.data <= dataFinalValue;


        return (

            filtroTipoOK &&

            filtroCategoriaOK &&

            filtroPesquisaOK &&

            filtroDataInicialOK &&

            filtroDataFinalOK
        );
    });


    // ORDENAR POR DATA
    transacoesFiltradas.sort(function(a, b) {

        return new Date(b.data) - new Date(a.data);
    });


    // CONTROLE DE MÊS
    let mesAtual = "";


    // RENDERIZAR
    transacoesFiltradas.forEach(function(transacao) {

        const mesTransacao = formatarMes(transacao.data);


        // NOVO MÊS
        if (mesTransacao !== mesAtual) {

            mesAtual = mesTransacao;

            const linhaMes = criarLinhaMes(mesAtual);

            historicoBody.appendChild(linhaMes);
        }


        // LINHA DA TRANSAÇÃO
        const linha = criarLinhaTransacao(transacao);

        historicoBody.appendChild(linha);
    });
}


// INICIALIZAÇÃO
atualizarTabela();


// EVENTOS DOS FILTROS
filtroTipo.addEventListener("change", atualizarTabela);

filtroCategoria.addEventListener("change", atualizarTabela);

pesquisa.addEventListener("input", atualizarTabela);

dataInicial.addEventListener("change", atualizarTabela);

dataFinal.addEventListener("change", atualizarTabela);


// EVENTO DE EXCLUSÃO
historicoBody.addEventListener("click", async function(event) {

    if(event.target.classList.contains("btnExcluir")) {

        const id = event.target.dataset.id;

        modalExcluir.style.display = "flex";

        confirmarExcluir.onclick = async function () {

            await excluirTransacao(id);

            modalExcluir.style.display = "none";

            mostrarToast(
                "Transação excluída com sucesso!",
                "sucesso"
            );

            atualizarTabela();

        };

        cancelarExcluir.onclick = function () {

            modalExcluir.style.display = "none";

        };
    }
});