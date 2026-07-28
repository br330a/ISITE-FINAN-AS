export function mostrarToast(mensagem, tipo = "sucesso") {

    const toast =
        document.createElement("div");

    toast.classList.add("toast");

    toast.classList.add(tipo);

    toast.innerHTML = `

        <span>${mensagem}</span>

        <div class="toastBarra"></div>

    `;

    document.body.appendChild(toast);

    setTimeout(function () {

        toast.classList.add("mostrar");

    }, 100);

    setTimeout(function () {

        toast.classList.remove("mostrar");

        setTimeout(function () {

            toast.remove();

        }, 300);

    }, 3000);

}