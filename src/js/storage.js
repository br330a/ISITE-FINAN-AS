// TRANSAÇÕES
export function carregarTransacoes() {

    return JSON.parse(
        localStorage.getItem("transacoes")
    ) || [];
}

export function salvarTransacoes(transacoes) {

    localStorage.setItem(
        "transacoes",
        JSON.stringify(transacoes)
    );
}


// METAS
export function carregarMetas() {

    return JSON.parse(
        localStorage.getItem("metas")
    ) || null;
}

export function salvarMetas(metas) {

    localStorage.setItem(
        "metas",
        JSON.stringify(metas)
    );
}