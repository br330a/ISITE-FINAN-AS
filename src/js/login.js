import { login } from "./api.js";

const formulario = document.getElementById("form-login");

formulario.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email = document.getElementById("email").value;

    const senha = document.getElementById("senha").value;

    try {

        const resposta = await login(email, senha);

        localStorage.setItem(
            "token",
            resposta.token
        );

        alert("Login realizado com sucesso!");

        window.location.href = "../../index.html";

    } catch (erro) {

        alert(erro.message);

    }

});