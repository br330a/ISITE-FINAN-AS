const API_URL = "http://localhost:3000";

function getToken() {
    return localStorage.getItem("token");
}

export async function buscarResumo() {

    const resposta = await fetch(
        `${API_URL}/transacoes/resumo`,
        {
            headers: {
                Authorization:
                    `Bearer ${getToken()}`
            }
        }
    );

    if (!resposta.ok) {
        throw new Error(
            "Erro ao buscar resumo"
        );
    }

    return await resposta.json();
}