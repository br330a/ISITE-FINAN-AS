export function verificarAutenticacao() {

    const token = localStorage.getItem("token");

    if (!token) {

        window.location.href = "src/pages/login.html";

    }
}

export function logout() {

    localStorage.removeItem("token");

    window.location.href = "src/pages/login.html";

}