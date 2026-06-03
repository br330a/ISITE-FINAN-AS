import { getTransacoes } from "./transacoes.js";
import { criarGraficos } from "./graficos.js";
import { iniciarMetas } from "./metas.js";

const filtroPeriodo = document.getElementById("filtroPeriodo");

const transacoes = getTransacoes();

function filtrarTransacoesPorPeriodo() {
    const periodo = filtroPeriodo.value;

    if (periodo === "todos") {
        return transacoes;
    }

    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();

    return transacoes.filter(function(transacao) {
        const dataTransacao = new Date(transacao.data + "T00:00:00");

        if (periodo === "mes") {
            return (
                dataTransacao.getMonth() === mesAtual &&
                dataTransacao.getFullYear() === anoAtual
            );
        }

        if (periodo === "ano") {
            return dataTransacao.getFullYear() === anoAtual;
        }

        return true;
    });
}

function atualizarDashboard() {
    const transacoesFiltradas = filtrarTransacoesPorPeriodo();

    criarGraficos(transacoesFiltradas);
}

atualizarDashboard();
iniciarMetas(transacoes);

filtroPeriodo.addEventListener("change", atualizarDashboard);