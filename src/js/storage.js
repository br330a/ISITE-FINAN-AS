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