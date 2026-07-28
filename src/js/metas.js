import {
    carregarMetas,
    salvarMetas
}
from "./storage.js";

import {
    criarTransacao
}
from "./api.js";

import {
    formatarMoeda
}
from "./utils.js";

import { mostrarToast } from "./toast.js";


export function iniciarMetas(transacoes){

    let metas = carregarMetas();

    if(!metas || !metas.vida){

        metas = {

            vida: {
                atual: 0,
                objetivo: 20000
            }
        };

        salvarMetas(metas);
    }


    const listaMetas =
        document.getElementById("ListaMetas");



    function criarMetaCard(nome, dados, emoji){

        const porcentagem =
            ((dados.atual / dados.objetivo) * 100);

        const faltando =
            dados.objetivo - dados.atual;


        listaMetas.innerHTML += `

            <div class="metaCard">

                <div class="metaIcone">
                    ${emoji}
                </div>

                <div class="metaInfo">

                    <div class="metaNome">
                        ${nome}
                    </div>

                    <div class="metaLinha">

                        <div class="barraMeta">

                            <div 
                                class="progressoMeta"

                                style="
                                    width:${porcentagem}%;
                                "
                            >

                                ${porcentagem.toFixed(0)}%

                            </div>

                        </div>

                        <div class="metaValores">

                            <span class="valorAtual">

                                ${formatarMoeda(dados.atual)}

                            </span>

                            /

                            <span class="valorObjetivo">

                                ${formatarMoeda(dados.objetivo)}

                            </span>

                        </div>

                    </div>

                    <div class ="metaRodape">

                        <div class="metaFaltando">

                            Faltam
                            ${formatarMoeda(faltando)}

                        </div>

                        <button class = "btnAdicionarMeta">
                            + Adicionar Valor
                        </button>

                    </div>

                </div>

            </div>
        `;
    }


    criarMetaCard(
        "Vida",
        metas.vida,
        "🏠"
    );



    const modalMeta =
        document.getElementById("modalMeta");

    const inputMeta =
        document.getElementById("inputMeta");



    document
        .querySelector(".btnAdicionarMeta")
        .addEventListener("click", function(){

            modalMeta.style.display = "flex";
        });



    document
        .getElementById("cancelarMeta")
        .addEventListener("click", function(){

            modalMeta.style.display = "none";
        });



    document
        .getElementById("salvarMeta")
        .addEventListener("click", async function(){

            const valor =
                Number(inputMeta.value);

            if(isNaN(valor) || valor <= 0){

                mostrarToast(
                    "Digite um valor válido.",
                    "erro"
                );

                return;
            }


            const novaTransacao = {

                id: crypto.randomUUID(),

                descricao: "Meta Vida",

                valor: valor,

                tipo: "meta",

                categoria: "meta",

                destinoMeta: "vida",

                data: new Date()
                    .toISOString()
                    .split("T")[0]
            };


            await criarTransacao(novaTransacao);


            metas.vida.atual += valor;

            salvarMetas(metas);


            modalMeta.style.display = "none";

            inputMeta.value = "";

            location.reload();
        });
}