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
        const erro = await resposta.json();

        console.error(erro);

        throw new Error(erro.erro);

    }

    return await resposta.json();
}

export async function criarTransacao(transacao) {

    const resposta = await fetch(
        `${API_URL}/transacoes`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                Authorization:
                    `Bearer ${getToken()}`
            },

            body: JSON.stringify(transacao)
        }
    );

    if (!resposta.ok) {

        throw new Error(
            "Erro ao cadastrar transação"
        );

    }

    return await resposta.json();

}

export async function buscarTransacoes() {

    const resposta = await fetch(
        `${API_URL}/transacoes`,
        {
            headers: {
                Authorization:
                    `Bearer ${getToken()}`
            }
        }
    );

    if (!resposta.ok) {

        throw new Error(
            "Erro ao buscar transações"
        );

    }

    const transacoes = await resposta.json();

    return transacoes.map(function(transacao) {

        return {

            ...transacao,

            valor: Number(transacao.valor),

            data: transacao.data_transacao.split("T")[0]

        };

    });

}

export async function login(email, senha) {

    const resposta = await fetch(
        `${API_URL}/usuarios/login`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                senha
            })
        }
    );

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(
            dados.erro || "Erro ao fazer login"
        );
    }

    return dados;
}

export async function cadastrarUsuario(usuario) {

    const resposta = await fetch(
        `${API_URL}/usuarios`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(usuario)
        }
    );

    const dados = await resposta.json();

    if (!resposta.ok) {

        throw new Error(
            dados.erro || "Erro ao cadastrar usuário"
        );

    }

    return dados;

}

export async function excluirTransacao(id) {

    const resposta = await fetch(
        `${API_URL}/transacoes/${id}`,
        {
            method: "DELETE",

            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        }
    );

    if (!resposta.ok) {
        throw new Error("Erro ao excluir transação");
    }

}

export async function atualizarTransacao(id, transacao) {

    const resposta = await fetch(

        `${API_URL}/transacoes/${id}`,

        {

            method: "PUT",

            headers: {

                "Content-Type": "application/json",

                Authorization:
                    `Bearer ${getToken()}`

            },

            body: JSON.stringify(transacao)

        }

    );

    if (!resposta.ok) {

        throw new Error(
            "Erro ao atualizar transação"
        );

    }

    return await resposta.json();

}

export async function buscarMetas() {

    const resposta = await fetch(

        `${API_URL}/metas`,

        {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        }

    );

    if (!resposta.ok) {

        throw new Error("Erro ao buscar metas");

    }

    return await resposta.json();

}



export async function criarMeta(meta) {

    const resposta = await fetch(

        `${API_URL}/metas`,

        {

            method: "POST",

            headers: {

                "Content-Type": "application/json",

                Authorization:
                    `Bearer ${getToken()}`

            },

            body: JSON.stringify(meta)

        }

    );

    if (!resposta.ok) {

        throw new Error("Erro ao criar meta");

    }

    return await resposta.json();

}



export async function atualizarMeta(id, meta) {

    const resposta = await fetch(

        `${API_URL}/metas/${id}`,

        {

            method: "PUT",

            headers: {

                "Content-Type": "application/json",

                Authorization:
                    `Bearer ${getToken()}`

            },

            body: JSON.stringify(meta)

        }

    );

    if (!resposta.ok) {

        throw new Error("Erro ao atualizar meta");

    }

    return await resposta.json();

}



export async function excluirMeta(id) {

    const resposta = await fetch(

        `${API_URL}/metas/${id}`,

        {

            method: "DELETE",

            headers: {

                Authorization:
                    `Bearer ${getToken()}`

            }

        }

    );

    if (!resposta.ok) {

        throw new Error("Erro ao excluir meta");

    }

}
