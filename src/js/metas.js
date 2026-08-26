import {

    buscarMetas,

    criarMeta,

    atualizarMeta,

    excluirMeta,

    criarTransacao

}
from "./api.js";

import {
    formatarMoeda,
    pegarDataAtualISO
} from "./utils.js";

import { mostrarToast } from "./toast.js";



//==================================================
// ELEMENTOS DA TELA
//==================================================

const btnNovaMeta =
    document.getElementById("btnNovaMeta");

const modalNovaMeta =
    document.getElementById("modalNovaMeta");

const nomeMeta =
    document.getElementById("nomeMeta");

const objetivoMeta =
    document.getElementById("objetivoMeta");

nomeMeta.addEventListener("keydown", function(event){

    if(event.key === "Enter"){

        criarNovaMeta.click();

    }

});

const cancelarNovaMeta =
    document.getElementById("cancelarNovaMeta");

const criarNovaMeta =
    document.getElementById("criarNovaMeta");


const modalMeta =
    document.getElementById("modalMeta");

const inputMeta =
    document.getElementById("inputMeta");

const modalExcluirMeta =
    document.getElementById("modalExcluirMeta");

const cancelarExcluirMeta =
    document.getElementById("cancelarExcluirMeta");

const confirmarExcluirMeta =
    document.getElementById("confirmarExcluirMeta");

const nomeMetaExcluir =
    document.getElementById("nomeMetaExcluir");

let metaExcluir = null;

const cancelarMeta =
    document.getElementById("cancelarMeta");

const salvarMeta =
    document.getElementById("salvarMeta");



let metas = [];

let metaSelecionada = null;



cancelarExcluirMeta.addEventListener(

    "click",

    function(){
        modalExcluirMeta.style.display = "none";

        metaExcluir = null;

    }

);


confirmarExcluirMeta.addEventListener(
    

    "click",

    async function(){
        try{

            const meta = metas.find(function(m){

                return m.id === metaExcluir;

            });

            if(Number(meta.valor_atual) > 0){

                await criarTransacao({

                    descricao: `Resgate automático da meta ${meta.nome}`,

                    valor: Number(meta.valor_atual),

                    tipo: "entrada",

                    categoria: "meta",

                    data_transacao: pegarDataAtualISO()

                });

            }

            await excluirMeta(metaExcluir);

            metas = metas.filter(function(meta){

                return meta.id !== metaExcluir;

            });

            renderizarMetas();

            modalExcluirMeta.style.display = "none";

            metaExcluir = null;

            mostrarToast(

                "Meta excluída com sucesso!",

                "sucesso"

            );

        }

        catch(erro){

            console.error(erro);

            mostrarToast(

                "Erro ao excluir a meta.",

                "erro"

            );

        }

    }

);



//==================================================
// ABRIR / FECHAR MODAL NOVA META
//==================================================

btnNovaMeta.addEventListener("click", function(){

    modalNovaMeta.style.display = "flex";

    nomeMeta.focus();
    

});


cancelarNovaMeta.addEventListener("click", function(){

    modalNovaMeta.style.display = "none";

    nomeMeta.value = "";

    objetivoMeta.value = "";

});


//Botao enter para confirmar

objetivoMeta.addEventListener("keydown", function(event){

    if(event.key === "Enter"){

        criarNovaMeta.click();

    }

    if(event.key === "Escape"){

        cancelarNovaMeta.click();

    }

    

});

inputMeta.addEventListener(

    "keydown",

    function(event){

        if(event.key === "Enter"){

            salvarMeta.click();

        }

        if(event.key === "Escape"){

            cancelarMeta.click();

        }

    }

);



//==================================================
// CARREGAR METAS
//==================================================

export async function iniciarMetas(){

    metas = await buscarMetas();

    renderizarMetas();

}



//==================================================
// RENDERIZAR
//==================================================

function renderizarMetas(){

    const listaMetas =
        document.getElementById("ListaMetas");

    listaMetas.innerHTML = "";

    metas.forEach(function(meta){

        const porcentagem =
            (Number(meta.valor_atual) /
            Number(meta.objetivo)) * 100;

        const faltando =
            Number(meta.objetivo) -
            Number(meta.valor_atual);

        listaMetas.innerHTML += `

            <div
                class="metaCard"
                data-id="${meta.id}"
            >

                <div class="metaIcone">
                    🎯
                </div>

                <div class="metaInfo">

                    <div class="metaNome">

                        ${meta.nome}

                    </div>

                    <div class="metaLinha">

                        <div class="barraMeta">

                            <div
                                class="progressoMeta"

                                style="width:${Math.min(porcentagem,100)}%;"

                            >

                                ${porcentagem.toFixed(0)}%

                            </div>

                        </div>

                        <div class="metaValores">

                            <span class="valorAtual">

                                ${formatarMoeda(
                                    Number(meta.valor_atual)
                                )}

                            </span>

                            /

                            <span class="valorObjetivo">

                                ${formatarMoeda(
                                    Number(meta.objetivo)
                                )}

                            </span>

                        </div>

                    </div>

                    <div class="metaRodape">

                        <div class="metaFaltando">

                            Faltam
                            ${formatarMoeda(faltando)}

                        </div>

                        <div class="acoesMeta">

                            <button
                                class="btnAdicionarMeta"
                                data-id="${meta.id}"
                            >

                                + Adicionar Valor

                            </button>

                            <button
                                class="btnResgatarMeta"
                                data-id="${meta.id}"
                            >

                                💸 Resgatar

                            </button>

                            <button
                                class="btnExcluirMeta"
                                data-id="${meta.id}"
                            >

                                🗑

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        `;

    });

}



//==================================================
// CRIAR META
//==================================================

criarNovaMeta.addEventListener(

    "click",

    async function(){

        const nome =
            nomeMeta.value.trim();

        const objetivo =
            Number(objetivoMeta.value);

        if(

            nome === "" ||

            isNaN(objetivo) ||

            objetivo <= 0

        ){

            mostrarToast(

                "Preencha todos os campos.",

                "erro"

            );

            return;

        }

        try{

            const metaCriada =
                await criarMeta({

                    nome,

                    objetivo,

                    valor_atual: 0

                });

            metas.push(metaCriada);

            renderizarMetas();

            modalNovaMeta.style.display = "none";

            nomeMeta.value = "";

            objetivoMeta.value = "";

            mostrarToast(

                "Meta criada com sucesso!"

            );
        }

        catch(erro){

            console.error(erro);

            mostrarToast(

                "Erro ao criar meta.",

                "erro"

            );

        }

    }

);


//==================================================
// ABRIR MODAL ADICIONAR VALOR
//==================================================

let modoMeta = "adicionar";


document.addEventListener("click", async function(event){

    //==============================
    // ADICIONAR
    //==============================

    if(event.target.classList.contains("btnAdicionarMeta")){

        metaSelecionada =
            Number(event.target.dataset.id);

        modoMeta = "adicionar";

        inputMeta.value = "";

        tituloModalMeta.innerText =
            "Adicionar valor à Meta";

        salvarMeta.innerText =
            "Adicionar";

        modalMeta.style.display = "flex";

        inputMeta.focus();

    }


    //==============================
    // RESGATAR
    //==============================

    if(event.target.classList.contains("btnResgatarMeta")){

        metaSelecionada =
            Number(event.target.dataset.id);

        modoMeta = "resgatar";

        inputMeta.value = "";

        tituloModalMeta.innerText =
            "Resgatar valor da Meta";

        salvarMeta.innerText =
            "Resgatar";

        modalMeta.style.display = "flex";

        inputMeta.focus();

    }


    //==============================
    // EXCLUIR
    //==============================

    

    if(event.target.classList.contains("btnExcluirMeta")){

        metaExcluir =
            Number(event.target.dataset.id);

        const meta = metas.find(function(m){

            return m.id === metaExcluir;

        });

        nomeMetaExcluir.innerText = `"${meta.nome}"`;

        modalExcluirMeta.style.display = "flex";

        confirmarExcluirMeta.focus();

        return;

    }
    

});



//==================================================
// FECHAR MODAL
//==================================================

cancelarMeta.addEventListener(

    "click",

    function(){

        modalMeta.style.display = "none";

        inputMeta.value = "";

    }

);



//==================================================
// SALVAR
//==================================================
console.log("Registrando evento salvarMeta");
salvarMeta.addEventListener(
    

    "click",
    

    async function(){

        console.count("CLICK SALVAR META");

        const valor =
            Number(inputMeta.value);

        if(

            isNaN(valor) ||

            valor <= 0

        ){

            mostrarToast(

                "Digite um valor válido.",

                "erro"

            );

            return;

        }

        const meta = metas.find(function(meta){

            return meta.id === metaSelecionada;

        });

        if(!meta){

            return;

        }

        let novoValor =
            Number(meta.valor_atual);

        if(modoMeta === "adicionar"){

            novoValor += valor;

        }

        if(modoMeta === "resgatar"){

            if(valor > Number(meta.valor_atual)){

                mostrarToast(

                    "Valor maior que o disponível.",

                    "erro"

                );

                return;

            }

            novoValor -= valor;

        }

        try{
            if(modoMeta === "adicionar"){
                console.log("ANTES criarTransacao");

                await criarTransacao({

                    

                    descricao: `Aporte na meta ${meta.nome}`,

                    valor: valor,

                    tipo: "meta",

                    categoria: "meta",

                    data_transacao: pegarDataAtualISO()

                });
                console.log("DEPOIS criarTransacao");

            }

            if(modoMeta === "resgatar"){
                

                await criarTransacao({

                    descricao: `Resgate da meta ${meta.nome}`,

                    valor: valor,

                    tipo: "entrada",

                    categoria: "meta",

                    data_transacao: pegarDataAtualISO()

                });

            }

            const metaAtualizada =
            
                await atualizarMeta(

                    meta.id,

                    {

                        nome: meta.nome,

                        objetivo: Number(meta.objetivo),

                        valor_atual: novoValor

                    }

                );

            const indice =
                metas.findIndex(function(m){

                    return m.id === meta.id;

                });

            metas[indice] =
                metaAtualizada;

            renderizarMetas();

            modalMeta.style.display = "none";

            inputMeta.value = "";

            mostrarToast(

                modoMeta === "adicionar"

                    ? "Valor adicionado!"

                    : "Resgate realizado!"

            );

        }

        catch(erro){

            console.error(erro);

            alert(erro.message);

            mostrarToast(

                "Erro ao excluir a meta.",

                "erro"

            );

        }
    }
    

);



