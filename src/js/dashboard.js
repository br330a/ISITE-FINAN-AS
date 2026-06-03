import { getTransacoes } from "./transacoes.js";
import { formatarMoeda } from "./utils.js";

export function atualizarCards() {
    const saldo = document.getElementById("saldo");
    const entrada = document.getElementById("entrada");
    const saida = document.getElementById("saida");

    if (!saldo || !entrada || !saida) {
        return;
    }

    const transacoes = getTransacoes();

    let totalEntrada = 0;
    let totalSaida = 0;

    transacoes.forEach(function(transacao) {
        if (transacao.tipo === "entrada") {
            totalEntrada += transacao.valor;
        } else if (
            transacao.tipo === "saida" ||
            transacao.tipo === "meta"
        ) {
            totalSaida += transacao.valor;
        }
    });

    const saldoTotal = totalEntrada - totalSaida;

    saldo.innerText = formatarMoeda(saldoTotal);
    entrada.innerText = formatarMoeda(totalEntrada);
    saida.innerText = formatarMoeda(totalSaida);
}