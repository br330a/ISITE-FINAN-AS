import {
    formatarMoeda
}
from "./utils.js";

let graficosAtivos = [];

Chart.register(ChartDataLabels);

function calcularGastosPorCategoria(transacoes) {

    const categorias = {};


    transacoes.forEach(function(transacao) {

        if(transacao.tipo === "saida") {

            if(categorias[transacao.categoria]) {

                categorias[transacao.categoria] += transacao.valor;

            } else {

                categorias[transacao.categoria] = transacao.valor;
            }
        }
    });


    return {

        nomesCategorias: Object.keys(categorias),

        valoresCategorias: Object.values(categorias)
    };
}


function calcularEntradasSaidas(transacoes) {

    let totalEntrada = 0;

    let totalSaida = 0;

    let totalMeta = 0;


    transacoes.forEach(function(transacao) {

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


    return {

        totalEntrada,

        totalSaida,

        totalMeta
    };
}


function calcularGastosPorMes(transacoes) {

    const gastosPorMes = {};


    transacoes.forEach(function(transacao) {

        if(transacao.tipo === "saida") {

            const data = new Date(transacao.data);

            const mes = data.toLocaleDateString("pt-BR", {
                month: "short"
            });


            if(gastosPorMes[mes]) {

                gastosPorMes[mes] += transacao.valor;

            } else {

                gastosPorMes[mes] = transacao.valor;
            }
        }
    });


    return {

        labelsMes: Object.keys(gastosPorMes),

        valoresMes: Object.values(gastosPorMes)
    };
}


export function criarGraficos(transacoesFiltradas){    

    graficosAtivos.forEach(function(grafico) {
        grafico.destroy();
    });

    graficosAtivos = [];

    //_____________________________________
    // GASTOS POR CATEGORIA
    //_____________________________________

    const {

        nomesCategorias,

        valoresCategorias

    } = calcularGastosPorCategoria(transacoesFiltradas);


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


    graficosAtivos.push(new Chart(ctxCategoria, {

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

                        if (total === 0) {
                            return "";
                        }

                        const porcentagem =
                            ((value / total) * 100).toFixed(0);

                        return porcentagem + "%";
                    }
                }
            }
        }
    }));


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

                    ${formatarMoeda(valoresCategorias[index])}

                </span>

            </div>
        `;
    });


    // TOTAL
    legendaCategoria.innerHTML += `

        <div class="totalLegenda">

            <span>Total gasto:</span>

            <span>
                ${formatarMoeda(totalCategorias)}
            </span>

        </div>
    `;


    //_____________________________________
    // ENTRADAS VS SAÍDAS
    //_____________________________________

    const {

        totalEntrada,

        totalSaida,

        totalMeta

    } = calcularEntradasSaidas(transacoesFiltradas);


    // PEGANDO CANVAS
    const ctxEntradaSaida =
        document.getElementById("graficoEntradaSaida");


    // CRIANDO GRÁFICO
    graficosAtivos.push(new Chart(ctxEntradaSaida, {

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

                        if (total === 0) {
                            return "";
                        }

                        const porcentagem =
                            ((value / total) * 100).toFixed(0);

                        return porcentagem + "%";
                    }
                }
            }
        }
    }));


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

                ${formatarMoeda(totalEntrada)}

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

                ${formatarMoeda(totalSaida)}

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

                ${formatarMoeda(totalMeta)}

            </span>

        </div>

        <div class="totalLegenda">

            <span>Saldo:</span>

            <span>
                ${formatarMoeda(saldo)}
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

    const saldoPorMes = {};

    transacoesOrdenadas.forEach(function(transacao){

        if(transacao.tipo === "entrada"){

            saldoAcumulado += transacao.valor;

        }

        if(

            transacao.tipo === "saida" ||

            transacao.tipo === "meta"

        ){

            saldoAcumulado -= transacao.valor;

        }

        const data = new Date(transacao.data);

        const chaveMes = data.toLocaleDateString(

            "pt-BR",

            {

                month: "short",

                year: "2-digit"

            }

        );

        saldoPorMes[chaveMes] = saldoAcumulado;

    });

    const labelsLinha = Object.keys(saldoPorMes);

    const dadosLinha = Object.values(saldoPorMes);

    // PEGANDO CANVAS
    const ctxLinha =
        document.getElementById("graficoLinha");


    // CRIANDO GRÁFICO
    graficosAtivos.push(new Chart(ctxLinha, {

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
                    suggestedMax: dadosLinha.length > 0
                        ? Math.max(...dadosLinha) + 100
                        : 100
                }
            }
        }
    }));


    //_____________________________________
    // GASTOS POR MÊS
    //_____________________________________

    const {
        labelsMes,

        valoresMes

    } = calcularGastosPorMes(transacoesFiltradas);


    // PEGANDO CANVAS
    const ctxMes =
        document.getElementById("graficoMes");


    // CRIANDO GRÁFICO
    graficosAtivos.push(new Chart(ctxMes, {

        type: "bar",

        data: {

            labels: labelsMes,

            datasets: [{

                label: "Gastos por Mês",

                data: valoresMes,

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
    }));

    atualizarIndicadores(transacoesFiltradas);

}

function atualizarIndicadores(transacoes) {

    const gastos =
        transacoes.filter(t => t.tipo === "saida");

    const receitas =
        transacoes.filter(t => t.tipo === "entrada");

    
    const mapaCategorias = {

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

    // Maior gasto
    if (gastos.length) {

        const maior = gastos.reduce((a, b) =>
            a.valor > b.valor ? a : b
        );

        document.getElementById("maiorGasto").innerText =
            formatarMoeda(maior.valor);

        document.getElementById("categoriaMaiorGasto").innerText =
            mapaCategorias[maior.categoria] ??
            maior.categoria;

    }


    // Maior receita
    if (receitas.length) {

        const maior = receitas.reduce((a, b) =>
            a.valor > b.valor ? a : b
        );

        document.getElementById("maiorReceita").innerText =
            formatarMoeda(maior.valor);

        document.getElementById("categoriaMaiorReceita").innerText =
            mapaCategorias[maior.categoria] ??
            maior.categoria;

    }


    // Categoria líder

    const totaisCategorias = {};

    gastos.forEach(t => {

        totaisCategorias[t.categoria] =
            (totaisCategorias[t.categoria] || 0) + t.valor;

    });

    let categoria = "-";
    let maiorValor = 0;

    Object.entries(totaisCategorias).forEach(([nome, valor]) => {

        if (valor > maiorValor) {

            categoria = nome;
            maiorValor = valor;

        }

    });

    document.getElementById("categoriaLider").innerText =
        mapaCategorias[categoria] ??
        categoria;

    document.getElementById("valorCategoriaLider").innerText =
        formatarMoeda(maiorValor);



    document.getElementById("totalTransacoes").innerText =
        transacoes.length;

}