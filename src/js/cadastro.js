import { cadastrarUsuario } from "./api.js";

const formulario =
    document.getElementById("form-login");

const mensagemErro =
    document.getElementById("mensagemErro");

const campoSenha =
    document.getElementById("senha");

const toggleSenha =
    document.getElementById("toggleSenha");

const campoConfirmarSenha =
    document.getElementById("confirmarSenha");

const toggleConfirmarSenha =
    document.getElementById("toggleConfirmarSenha");




formulario.addEventListener("submit", async function(event){

    event.preventDefault();

    mensagemErro.innerText = "";

    const nome =
        document.getElementById("nome").value;

    const email =
        document.getElementById("email").value;

    const senha =
        document.getElementById("senha").value;

    const confirmarSenha =
        document.getElementById("confirmarSenha").value;

    if(senha !== confirmarSenha){

        mensagemErro.innerText =
            "As senhas não coincidem.";

        return;

    }

    try{

        await cadastrarUsuario({
            nome,
            email,
            senha
        });

        window.location.href =
            "./login.html";

    }catch(erro){

        mensagemErro.innerText =
            erro.message;

    }

});


toggleSenha.addEventListener("click", function () {

    if (campoSenha.type === "password") {

        campoSenha.type = "text";

        toggleSenha.classList.replace(
            "fa-eye",
            "fa-eye-slash"
        );

    } else {

        campoSenha.type = "password";

        toggleSenha.classList.replace(
            "fa-eye-slash",
            "fa-eye"
        );

    }

});

toggleConfirmarSenha.addEventListener("click", function () {

    if (campoConfirmarSenha.type === "password") {

        campoConfirmarSenha.type = "text";

        toggleConfirmarSenha.classList.replace(
            "fa-eye",
            "fa-eye-slash"
        );

    } else {

        campoConfirmarSenha.type = "password";

        toggleConfirmarSenha.classList.replace(
            "fa-eye-slash",
            "fa-eye"
        );

    }

}); 