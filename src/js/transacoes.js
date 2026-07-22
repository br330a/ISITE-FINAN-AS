import {
    carregarTransacoes,
    salvarTransacoes
} from "./storage.js";


// ARRAY CENTRAL
let transacoes = carregarTransacoes();


// PEGAR TRANSAÇÕES
export function getTransacoes() {

    return [...transacoes];
}


// ADICIONAR TRANSAÇÃO
export function adicionarTransacao(transacao) {

    transacoes.push(transacao);

    salvarTransacoes(transacoes);
}


export function deletarTransacao(id) {

    transacoes = transacoes.filter(function(transacao) {

        return transacao.id !== id;
    });

    salvarTransacoes(transacoes);
}