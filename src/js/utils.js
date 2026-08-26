// FORMATAR MOEDA
export function formatarMoeda(valor){

    return valor.toLocaleString("pt-BR", {

        style: "currency",

        currency: "BRL"
    });
}

// FORMATAR DATA
export function formatarData(data) {

    if (!data) {
        return "";
    }

    const dataSemHora = String(data).split("T")[0];

    const [ano, mes, dia] = dataSemHora.split("-");

    return `${dia}/${mes}/${ano}`;
}

// DATA ATUAL
export function pegarDataAtual() {

    return new Date()
        .toLocaleDateString("pt-BR");
}

export function pegarDataAtualISO() {

    const hoje = new Date();

    const ano = hoje.getFullYear();

    const mes = String(
        hoje.getMonth() + 1
    ).padStart(2, "0");

    const dia = String(
        hoje.getDate()
    ).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}