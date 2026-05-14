const hoje = new Date();
const descricao = document.getElementById("descricao");
const valor = document.getElementById("valor");
const tipo = document.getElementById("tipo");
const categoria = document.getElementById("categoria");
const data = document.getElementById("data");
const botao = document.getElementById("adicionar");

document.getElementById("data-atual").innerText = hoje.toLocaleDateString("pt-BR")



let transacoes = [];

document.getElementById("adicionar").addEventListener("click", function(){
    const descricao = document.getElementById("descricao").value;
    const valor = document.getElementById("valor").value;
    const tipo = document.getElementById("tipo").value;
    const categoria = document.getElementById("categoria").value;
    const data = document.getElementById("data").value;

    const transacao = {
        descricao: descricao,
        valor: Number(valor),
        tipo: tipo,
        categoria: categoria,
        data: data,
    };
    transacoes.push(transacao);

    console.log(transacoes);
});
