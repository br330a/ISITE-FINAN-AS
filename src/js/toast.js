export function mostrarToast(mensagem, tipo = "sucesso"){

    document
        .querySelectorAll(".toast")
        .forEach(function(toast){

            toast.remove();

        });

    const toast =
        document.createElement("div");

    toast.className =
        `toast ${tipo}`;

    toast.innerHTML = `

        <span>

            ${mensagem}

        </span>

        <div class="toastBarra"></div>

    `;

    document.body.appendChild(toast);

    requestAnimationFrame(function(){

        toast.classList.add("mostrar");

    });

    setTimeout(function(){

        toast.classList.remove("mostrar");

        setTimeout(function(){

            toast.remove();

        },350);

    },3000);

}