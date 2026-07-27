import { login } from "./api.js";

const formulario = document.getElementById("form-login");

const mensagemErro =
    document.getElementById("mensagemErro");

const campoSenha =
    document.getElementById("senha");

const toggleSenha =
    document.getElementById("toggleSenha");


toggleSenha.addEventListener("click", function(){

    if(campoSenha.type === "password"){

        campoSenha.type = "text";

        toggleSenha.classList.replace(
            "fa-eye",
            "fa-eye-slash"
        );

    }else{

        campoSenha.type = "password";

        toggleSenha.classList.replace(
            "fa-eye-slash",
            "fa-eye"
        );

    }

});

formulario.addEventListener("submit", async function (event) {

    event.preventDefault();

    mensagemErro.innerText = "";

    const email = document.getElementById("email").value;

    const senha = document.getElementById("senha").value;

    try {

        const resposta = await login(email, senha);

        localStorage.setItem(
            "token",
            resposta.token
        );

        window.location.href = "../../index.html";

    } catch (erro) {

        mensagemErro.innerText = erro.message;

    }

});