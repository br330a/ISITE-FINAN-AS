//_____________________________________
// CARREGAR DADOS
//_____________________________________

let transacoes = [];

function carregarDados() {

    const dados = localStorage.getItem("transacoes");

    if(dados) {
        transacoes = JSON.parse(dados);
    }
}

carregarDados();


//define e pega o ultimo filtro usado e coloca na box
const filtro =
    document.getElementById("filtroPeriodo");


const filtroSalvo =
    localStorage.getItem("filtroDashboard");


if(filtroSalvo){

    filtro.value = filtroSalvo;
}


let transacoesFiltradas =
    [...transacoes];


//função de filtrar
function aplicarFiltro(recarregar = true){

    const valorFiltro =
        filtro.value;

    const hoje = new Date();

    
    if(valorFiltro === "todos"){

        transacoesFiltradas =
            [...transacoes];
    }


    if(valorFiltro === "mes"){

        transacoesFiltradas =
            transacoes.filter(function(transacao){

                const data =
                    new Date(transacao.data);

                return (
                    data.getMonth() ===
                    hoje.getMonth()

                    &&

                    data.getFullYear() ===
                    hoje.getFullYear()
                );
            });
    }


    if(valorFiltro === "ano"){

        transacoesFiltradas =
            transacoes.filter(function(transacao){

                const data =
                    new Date(transacao.data);

                return (
                    data.getFullYear() ===
                    hoje.getFullYear()
                );
            });
    }

    localStorage.setItem(
        "filtroDashboard",
        valorFiltro
    );  
    if(recarregar){
        location.reload();
    }
}

filtro.addEventListener(
    "change",
    aplicarFiltro
);

aplicarFiltro(false);


//_____________________________________
// GASTOS POR CATEGORIA
//_____________________________________

const categorias = {};

// SOMA DOS GASTOS POR CATEGORIA
transacoesFiltradas.forEach(function(transacao){

    if(transacao.tipo === "saida") {

        if(categorias[transacao.categoria]) {

            categorias[transacao.categoria] += transacao.valor;

        } 
        
        else {

            categorias[transacao.categoria] = transacao.valor;
        }
    }
});

console.log(categorias);


// TRANSFORMANDO OBJETO EM ARRAYS
const nomesCategorias = Object.keys(categorias);

const valoresCategorias = Object.values(categorias);


// CORES DOS GRÁFICOS
const cores = [
    "#3B82F6",
    "#22C55E",
    "#F59E0B",
    "#8B5CF6",
    "#EF4444",
    "#EC4899",
    "#14B8A6"
];


// PEGANDO O CANVAS
const ctxCategoria =
    document.getElementById("graficoCategoria");




// CRIANDO O GRÁFICO
Chart.register(ChartDataLabels);


console.log(ChartDataLabels);
new Chart(ctxCategoria, {

    type: "doughnut",

    data: {

        labels: nomesCategorias,

        datasets: [{
            data: valoresCategorias,

            backgroundColor: cores,

            borderWidth: 0
        }]
    },

    options: {

        responsive: true,

        cutout: "45%",

        plugins: {

            legend: {
                display: false
            },

            datalabels: {
                color: "white",
                font: {
                    weight: "bold",
                    size: 16
                },

                formatter: (value, context) => {

                    const total = context.chart.data.datasets[0].data
                        .reduce((a, b) => a + b, 0);

                    const porcentagem =
                        ((value / total) * 100).toFixed(0);

                    return porcentagem + "%";
                }
            }
        }
    }
});


//_____________________________________
// LEGENDA PERSONALIZADA
//_____________________________________

const legendaCategoria =
    document.getElementById("legendaCategoria");

legendaCategoria.innerHTML = "";

let totalCategorias = 0;


// SOMA TOTAL
valoresCategorias.forEach(function(valor){

    totalCategorias += valor;
});


// CRIANDO ITENS DA LEGENDA
nomesCategorias.forEach(function(categoria, index){

    legendaCategoria.innerHTML += `

        <div class="itemLegenda">

            <div class="infoLegenda">

                <div 
                    class="bolinha"
                    style="background:${cores[index]}"
                ></div>

                <span>${categoria}</span>

            </div>

            <span class="valorLegenda">

                R$ ${valoresCategorias[index].toFixed(2)}

            </span>

        </div>
    `;
});


// TOTAL
legendaCategoria.innerHTML += `

    <div class="totalLegenda">

        <span>Total gasto:</span>

        <span>
            R$ ${totalCategorias.toFixed(2)}
        </span>

    </div>
`;


//_____________________________________
// ENTRADAS VS SAÍDAS
//_____________________________________

let totalEntrada = 0;
let totalSaida = 0;
let totalMeta = 0;


// CALCULANDO
transacoesFiltradas.forEach(function(transacao){

    if(transacao.tipo === "entrada") {

        totalEntrada += transacao.valor;
    }

    if(transacao.tipo === "saida") {
        totalSaida += transacao.valor;
    }

    if(transacao.tipo === "meta") {
        totalMeta += transacao.valor;
    }
});


// PEGANDO CANVAS
const ctxEntradaSaida =
    document.getElementById("graficoEntradaSaida");


// CRIANDO GRÁFICO
new Chart(ctxEntradaSaida, {

    type: "doughnut",

    data: {

        labels: ["Entradas", "Saídas", "Meta"],

        datasets: [{

            data: [totalEntrada, totalSaida, totalMeta],

            backgroundColor: [
                "#22C55E",
                "#EF4444",
                "#3B82F6"
            ],

            borderWidth: 0
        }]
    },

    options: {

        responsive: true,

        cutout: "45%",

        plugins: {

            legend: {
                display: false
            },

            datalabels: {

                color: "white",

                font: {
                    weight: "bold",
                    size: 16
                },

                formatter: (value, context) => {

                    const total = context.chart.data.datasets[0].data
                        .reduce((a, b) => a + b, 0);

                    const porcentagem =
                        ((value / total) * 100).toFixed(0);

                    return porcentagem + "%";
                }
            }
        }
    }
});


//_____________________________________
// LEGENDA ENTRADA VS SAÍDA
//_____________________________________

const legendaEntradaSaida =
    document.getElementById("legendaEntradaSaida");

const saldo = totalEntrada - totalSaida - totalMeta;

legendaEntradaSaida.innerHTML = `

    <div class="itemLegenda">

        <div class="infoLegenda">

            <div 
                class="bolinha"
                style="background:#22C55E"
            ></div>

            <span>Entradas</span>

        </div>

        <span class="valorLegenda">

            R$ ${totalEntrada.toFixed(2)}

        </span>

    </div>


    <div class="itemLegenda">

        <div class="infoLegenda">

            <div 
                class="bolinha"
                style="background:#EF4444"
            ></div>

            <span>Saídas</span>

        </div>

        <span class="valorLegenda">

            R$ ${totalSaida.toFixed(2)}

        </span>

    </div>

    <div class="itemLegenda">

        <div class="infoLegenda">

            <div 
                class="bolinha"
                style="background:#3B82F6"
            ></div>

            <span>Meta</span>

        </div>

        <span class="valorLegenda">

            R$ ${totalMeta.toFixed(2)}

        </span>

    </div>

    <div class="totalLegenda">

        <span>Saldo:</span>

        <span>
            R$ ${saldo.toFixed(2)}
        </span>

    </div>
`;


//_____________________________________
// EVOLUÇÃO DO SALDO
//_____________________________________

const transacoesOrdenadas = [...transacoesFiltradas].sort(function(a, b){

    return new Date(a.data) - new Date(b.data);
});


let saldoAcumulado = 0;

const labelsLinha = [];
const dadosLinha = [];


// CALCULANDO
transacoesOrdenadas.forEach(function(transacao){

    if(transacao.tipo === "entrada") {

        saldoAcumulado += transacao.valor;
    }

    if(
        transacao.tipo === "saida" ||
        transacao.tipo === "meta"
    ){
        saldoAcumulado -= transacao.valor;
    }

    labelsLinha.push(transacao.data);

    dadosLinha.push(saldoAcumulado);
});


// PEGANDO CANVAS
const ctxLinha =
    document.getElementById("graficoLinha");


// CRIANDO GRÁFICO
new Chart(ctxLinha, {

    type: "line",

    data: {

        labels: labelsLinha,

        datasets: [{

            label: "Saldo",

            data: dadosLinha,

            borderColor: "#3B82F6",

            backgroundColor: "rgba(59,130,246,0.15)",

            tension: 0.4,

            fill: true,

            borderWidth: 3,

            pointRadius: 5,

            pointBackgroundColor: "#3B82F6"
        }]
    },

    options: {

        responsive: true,

        plugins: {

            datalabels: {

                align: "top",

                anchor: "end",

                offset: 10,

                color: "#111827",

                font: {
                    weight: "bold",
                    size: 13
                },

                formatter: (value) => {
                    return "R$ " + value.toFixed(2);
                }
            }
        },

        scales: {
            y: {
                suggestedMax: Math.max(...dadosLinha) + 100
            }
        }
    }
});


//_____________________________________
// GASTOS POR MÊS
//_____________________________________

const gastosPorMes = {};


// SOMANDO GASTOS
transacoesFiltradas.forEach(function(transacao){

    if(transacao.tipo === "saida") {

        const data = new Date(transacao.data);

        const mes = data.toLocaleDateString("pt-BR", {
            month: "short"
        });


        if(gastosPorMes[mes]) {

            gastosPorMes[mes] += transacao.valor;
        }

        else {

            gastosPorMes[mes] = transacao.valor;
        }
    }
});


// PEGANDO CANVAS
const ctxMes =
    document.getElementById("graficoMes");


// CRIANDO GRÁFICO
new Chart(ctxMes, {

    type: "bar",

    data: {

        labels: Object.keys(gastosPorMes),

        datasets: [{

            label: "Gastos por Mês",

            data: Object.values(gastosPorMes),

            backgroundColor: "#3B82F6",

            borderRadius: 8,

            borderSkipped: false,

            borderWidth: 0
        }]
    },

    options: {

        responsive: true,

        plugins: {
            datalabels: {

                anchor: "end",
                align: "top",

                color: "#111827",

                font: {
                    weight: "bold",
                    size: 14
                },

                formatter: (value) => {
                    return "R$ " + value.toFixed(2);
                }
            }
        }
    }
});


//METAS
let metas = JSON.parse(localStorage.getItem("metas"));

if(!metas){
    metas = {
        vida: {
            atual: 0,
            objetivo: 20000
        }
    };

    localStorage.setItem(
        "metas",
        JSON.stringify(metas)
    );
}

const listaMetas =
    document.getElementById("ListaMetas");


// FUNÇÃO PARA CRIAR CARD
function criarMetaCard(nome, dados, emoji){

    const porcentagem =
        ((dados.atual / dados.objetivo) * 100);

    
    const porcentagemFormatada =
        porcentagem.toFixed(0);


    const faltando =
        dados.objetivo - dados.atual;


    listaMetas.innerHTML += `

        <div class="metaCard">

            <div class="metaIcone">

                ${emoji}

            </div>

            <div class="metaInfo">

                <div class="metaNome">

                    ${nome}

                </div>

                <div class="metaLinha">

                    <div class="barraMeta">

                        <div 
                            class="progressoMeta"

                            style="
                                width:${porcentagem}%;
                            "
                        >

                            ${porcentagemFormatada}%

                        </div>

                    </div>

                    <div class="metaValores">

                        <span class="valorAtual">

                            R$ ${dados.atual.toFixed(2)}

                        </span>

                        /

                        <span class="valorObjetivo">

                            R$ ${dados.objetivo.toFixed(2)}

                        </span>

                    </div>

                </div>
                <div class ="metaRodape">
                    <div class="metaFaltando">

                        Faltam
                        R$ ${faltando.toFixed(2)}

                    </div>

                    <button class = "btnAdicionarMeta">
                        + Adicionar Valor
                    </button>
                </div>

            </div>

        </div>
    `;
}

criarMetaCard(
    "Vida",
    metas.vida,
    "🏠"
);

const modalMeta = document.getElementById("modalMeta");
const inputMeta = document.getElementById("inputMeta");


// abrindo modal
document
    .querySelector(".btnAdicionarMeta")
    .addEventListener("click", function(){

        modalMeta.style.display = "flex";
    });

//fechando modal
document
    .getElementById("cancelarMeta")
    .addEventListener("click", function(){

        modalMeta.style.display = "none";
    });

//salvando meta
document
    .getElementById("salvarMeta")
    .addEventListener("click", function(){

        const valor =
            Number(inputMeta.value);

        if(isNaN(valor) || valor <= 0){

            alert("Digite um valor válido");

            return;
        }


        //criando transacao
        const novaTransacao = {

            descricao: "Meta Vida",

            valor: valor,

            tipo: "meta",

            categoria: "meta",

            destinoMeta: "vida",

            data: new Date()
                .toISOString()
                .split("T")[0]
        };


        //adicionando transacao
        transacoes.push(novaTransacao);


        //salvando transacao
        localStorage.setItem(
            "transacoes",
            JSON.stringify(transacoes)
        );


        //atualizando meta
        metas.vida.atual += valor;


        //salvando meta
        localStorage.setItem(
            "metas",
            JSON.stringify(metas)
        );


        //fechando modal
        modalMeta.style.display = "none";


        //limpando input
        inputMeta.value = "";


        //recarregando  
        location.reload();
    });
