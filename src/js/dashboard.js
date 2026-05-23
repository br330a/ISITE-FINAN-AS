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

console.log(transacoes);


//_____________________________________
// GASTOS POR CATEGORIA
//_____________________________________

const categorias = {};

// SOMA DOS GASTOS POR CATEGORIA
transacoes.forEach(function(transacao){

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


// CALCULANDO
transacoes.forEach(function(transacao){

    if(transacao.tipo === "entrada") {

        totalEntrada += transacao.valor;
    }

    else {

        totalSaida += transacao.valor;
    }
});


// PEGANDO CANVAS
const ctxEntradaSaida =
    document.getElementById("graficoEntradaSaida");


// CRIANDO GRÁFICO
new Chart(ctxEntradaSaida, {

    type: "doughnut",

    data: {

        labels: ["Entradas", "Saídas"],

        datasets: [{

            data: [totalEntrada, totalSaida],

            backgroundColor: [
                "#22C55E",
                "#EF4444"
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

const saldo = totalEntrada - totalSaida;

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

const transacoesOrdenadas = [...transacoes].sort(function(a, b){

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

    else {

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
transacoes.forEach(function(transacao){

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