import {
    buscarTransacoes,
    excluirTransacao,
    atualizarTransacao
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


const modalEditar =
    document.getElementById("modalEditar");

const cancelarEditar =
    document.getElementById("cancelarEditar");

const salvarEditar =
    document.getElementById("salvarEditar");

const editarDescricao =
    document.getElementById("editarDescricao");

const editarValor =
    document.getElementById("editarValor");

const editarTipo =
    document.getElementById("editarTipo");

const editarCategoria =
    document.getElementById("editarCategoria");

const editarData =
    document.getElementById("editarData");

let transacaoEditando = null;


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


function criarLinhaMes(mesAtual) {

    const linhaMes = document.createElement("tr");

    linhaMes.classList.add("linhaMes");

    const tdMes = document.createElement("td");

    tdMes.colSpan = 6;

    tdMes.innerHTML = `

        <div class="headerMes">

            <span>

                ${mesAtual}

            </span>

            <button
                class="btnExportarMes"
                data-mes="${mesAtual}"
            >

                📄 Exportar

            </button>

        </div>

    `;

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

    const badgeTipo = document.createElement("span");

    if(transacao.tipo === "entrada"){

        badgeTipo.innerText = "Entrada";

    }

    else if(transacao.tipo === "meta"){

        badgeTipo.innerText = "Meta";

    }

    else{

        badgeTipo.innerText = "Saída";

    }

    badgeTipo.classList.add(transacao.tipo);

    tdTipo.appendChild(badgeTipo);

    linha.appendChild(tdTipo);


    // CATEGORIA
    const tdCategoria = document.createElement("td");

    const categorias = {

        alimentacao: "🍔 Alimentação",

        transporte: "🚗 Transporte",

        moradia: "🏠 Moradia",

        contas: "💡 Contas",

        mercado: "🛒 Mercado",

        estudos: "🎓 Estudos",

        trabalho: "💼 Trabalho",

        saude: "💊 Saúde",

        academia: "🏋️ Academia",

        lazer: "🎮 Lazer",

        assinaturas: "🎬 Assinaturas",

        compras: "🛍️ Compras",

        roupas: "👕 Roupas",

        pets: "🐶 Pets",

        viagem: "✈️ Viagem",

        presentes: "🎁 Presentes",

        namorada: "❤️ Namorada",

        investimentos: "💰 Investimentos",

        salario: "💵 Salário",

        renda_extra: "📈 Renda Extra",

        outros: "📦 Outros"

    };

    tdCategoria.innerText =
        categorias[transacao.categoria] ??
        transacao.categoria;

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
        const botaoEditar =
            document.createElement("button");

        botaoEditar.innerText = "✏️";

        botaoEditar.classList.add("btnEditar");

        botaoEditar.dataset.id = transacao.id;

        tdBotao.appendChild(botaoEditar);


        const botaoExcluir =
            document.createElement("button");

        botaoExcluir.innerText = "🗑️";

        botaoExcluir.classList.add("btnExcluir");

        botaoExcluir.dataset.id = transacao.id;

        tdBotao.appendChild(botaoExcluir);
    }

    linha.appendChild(tdBotao);


    return linha;
}


async function carregarCategorias(){
    const transacoes =
        await buscarTransacoes();

    const categorias = [

        ...new Set(

            transacoes.map(function(transacao){

                return transacao.categoria;

            })

        )

    ];

    filtroCategoria.innerHTML = `

        <option value="todos">

            Todas

        </option>

    `;

    categorias.forEach(function(categoria){

        filtroCategoria.innerHTML += `

            <option value="${categoria}">

                ${categoria}

            </option>

        `;

    });

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

        return b.data.localeCompare(a.data);
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

    document
        .querySelectorAll(".btnExportarMes")
        .forEach(function(botao){

            botao.addEventListener("click", function(){

                const mes = this.dataset.mes;

                const transacoesMes = transacoesFiltradas.filter(function(transacao){

                    return formatarMes(transacao.data) === mes;

                });

                gerarPDFMes(mes, transacoesMes);

            });

        });
}


// INICIALIZAÇÃO
await carregarCategorias();

await atualizarTabela();


// EVENTOS DOS FILTROS
filtroTipo.addEventListener("change", atualizarTabela);

filtroCategoria.addEventListener("change", atualizarTabela);

pesquisa.addEventListener("input", atualizarTabela);

dataInicial.addEventListener("change", atualizarTabela);

dataFinal.addEventListener("change", atualizarTabela);



document
    .getElementById("btnLimparFiltros")
    .addEventListener("click", function(){

        document.getElementById("pesquisa").value = "";

        document.getElementById("filtroCategoria").value = "todos";

        document.getElementById("filtroTipo").value = "todos";

        dataInicial.value = "";

        dataFinal.value = "";

        atualizarTabela();

    });

// EVENTO DE EXCLUSÃO
historicoBody.addEventListener("click", async function(event) {

    if (event.target.classList.contains("btnEditar")) {

        const id = event.target.dataset.id;

        const transacoes =
            await buscarTransacoes();

        transacaoEditando =
            transacoes.find(function (transacao) {

                return transacao.id == id;

            });

        editarDescricao.value =
            transacaoEditando.descricao;

        editarValor.value =
            transacaoEditando.valor;

        editarTipo.value =
            transacaoEditando.tipo;

        editarCategoria.value =
            transacaoEditando.categoria;

        editarData.value =
            transacaoEditando.data;

        modalEditar.style.display = "flex";

        editarDescricao.focus();

    }

    if(event.target.classList.contains("btnExcluir")) {

        const id = event.target.dataset.id;

        modalExcluir.style.display = "flex";

        confirmarExcluir.focus();

        confirmarExcluir.onclick = async function () {

            await excluirTransacao(id);

            modalExcluir.style.display = "none";

            mostrarToast(
                "Transação excluída com sucesso!",
                "sucesso"
            );

            atualizarTabela();

        };
        
        modalExcluir.onkeydown = function(event){

            if(event.key === "Enter"){

                confirmarExcluir.click();

            }

            if(event.key === "Escape"){

                cancelarExcluir.click();

            }

        };

        cancelarExcluir.onclick = function () {

            modalExcluir.style.display = "none";

        };
    }
});

cancelarEditar.addEventListener("click", function () {

    modalEditar.style.display = "none";

});

salvarEditar.addEventListener("click", async function () {
    console.log("CLIQUEI NO SALVAR");
    try {

        await atualizarTransacao(

            transacaoEditando.id,

            {

                descricao:
                    editarDescricao.value,

                valor:
                    Number(editarValor.value),

                tipo:
                    editarTipo.value,

                categoria:
                    editarCategoria.value,

                data_transacao:
                    editarData.value

            }

        );

        modalEditar.style.display = "none";

        mostrarToast(

            "Transação atualizada com sucesso!",

            "sucesso"

        );

        atualizarTabela();

    } catch (erro) {

        console.error(erro);

        mostrarToast(

            "Erro ao atualizar transação.",

            "erro"

        );

    }

});


function gerarPDFMes(mes, transacoes){

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    doc.setFontSize(18);

    doc.text("ISITE Finanças", 14, 18);

    doc.setFontSize(12);

    doc.text(`Extrato - ${mes}`, 14, 28);

    const linhas = transacoes.map(function(transacao){

        return [

            formatarData(transacao.data),

            transacao.descricao,

            transacao.categoria,

            transacao.tipo,

            formatarMoeda(transacao.valor)

        ];

    });

    doc.autoTable({

        head: [[

            "Data",

            "Descrição",

            "Categoria",

            "Tipo",

            "Valor"

        ]],

        body: linhas,

        startY: 38

    });

    doc.save(`Extrato-${mes}.pdf`);

}

window.addEventListener("click", function (event) {

    if (event.target === modalEditar) {

        modalEditar.style.display = "none";

    }

    if (event.target === modalExcluir) {

        modalExcluir.style.display = "none";

    }
});

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {

        modalEditar.style.display = "none";

        modalExcluir.style.display = "none";

        modalLogout.style.display = "none";

    }

});

modalEditar.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        event.preventDefault();

        salvarEditar.click();

    }

});