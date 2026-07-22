import { buscarResumo } from "./api.js";
import { formatarMoeda } from "./utils.js";

export async function atualizarCards() {

    const saldo = document.getElementById("saldo");
    const entrada = document.getElementById("entrada");
    const saida = document.getElementById("saida");

    if (!saldo || !entrada || !saida) {
        return;
    }

    try {

        const resumo = await buscarResumo();

        saldo.innerText = formatarMoeda(resumo.saldo);
        entrada.innerText = formatarMoeda(resumo.entradas);
        saida.innerText = formatarMoeda(resumo.saidas);

    } catch (erro) {

        console.error("Erro ao carregar resumo:", erro);

    }

}