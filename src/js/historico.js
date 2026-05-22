const historicoBody = document.getElementById("historico-body");

const filtroTipo = document.getElementById("filtroTipo");

const filtroCategoria = document.getElementById("filtroCategoria");

const pesquisa = document.getElementById("pesquisa");

const dataInicial = document.getElementById("dataInicial");
const dataFinal = document.getElementById("dataFinal");



let transacoes = [];

function carregarDados() {
    const dados = localStorage.getItem("transacoes");
    if(dados) {
        transacoes = JSON.parse(dados);
    }
}


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

function atualizarTabela() {  
    historicoBody.innerHTML = "";

    const tipoSelecionado = filtroTipo.value;
    const categoriaSelecionada = filtroCategoria.value;
    const textoPesquisa = pesquisa.value.toLowerCase();

    const dataInicialValue = dataInicial.value;
    const dataFinalValue = dataFinal.value;

    const transacoesFiltradas = transacoes.filter(function(transacao){

        const filtroTipoOK = 
            tipoSelecionado === "todos" || transacao.tipo === tipoSelecionado;
        
        const filtroCategoriaOK =
            categoriaSelecionada === "todos" || transacao.categoria === categoriaSelecionada;
        
        const filtroPesquisaOK =
            transacao.descricao.toLowerCase().includes(textoPesquisa);


        const filtroDataInicialOK =
            !dataInicialValue || transacao.data >= dataInicialValue;

        const filtroDataFinalOK =
            !dataFinalValue || transacao.data <= dataFinalValue;

        return (
            filtroTipoOK && filtroCategoriaOK && filtroPesquisaOK && filtroDataInicialOK && filtroDataFinalOK
        );
    });

    transacoesFiltradas.sort(function(a, b){
        return new Date(b.data) - new Date(a.data);  //coloca mais recentes primeiro
    });

    let mesAtual = "";

    transacoesFiltradas.forEach(function(transacao, index){

        const mesTransacao = formatarMes(transacao.data);

        if(mesTransacao !== mesAtual) {
            mesAtual = mesTransacao;

            historicoBody.innerHTML += `
                <tr class="linhaMes">
                    <td colspan="6">
                        ${mesAtual}
                    </td>
                </tr>
            `;
        }

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
atualizarTabela();

function deletarTransacao(index) {
    transacoes.splice(index, 1);

    localStorage.setItem(
        "transacoes", 
        JSON.stringify(transacoes)
    );
    atualizarTabela();
}


filtroTipo.addEventListener("change", atualizarTabela);
filtroCategoria.addEventListener("change", atualizarTabela);
pesquisa.addEventListener("input", atualizarTabela);

dataInicial.addEventListener("change", atualizarTabela);
dataFinal.addEventListener("change", atualizarTabela);



