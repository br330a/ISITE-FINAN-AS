// FORMATAR MOEDA
export function formatarMoeda(valor){

    return valor.toLocaleString("pt-BR", {

        style: "currency",

        currency: "BRL"
    });
}

// FORMATAR DATA
export function formatarData(data) {

    return new Date(data)
        .toLocaleDateString("pt-BR");
}


// DATA ATUAL
export function pegarDataAtual() {

    return new Date()
        .toLocaleDateString("pt-BR");
}