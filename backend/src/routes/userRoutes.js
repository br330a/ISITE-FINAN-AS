const express = require("express");
const autenticarToken = require("../middleware/authMiddleware");
const router = express.Router();

const {
    criarUsuario,
    login
} = require("../controllers/userController");

router.post("/", criarUsuario);
router.post("/login", login);

router.get(
    "/perfil",
    autenticarToken,
    (req, res) => {

        res.json({
            message: "Área protegida",
            usuario: req.usuario
        });

    }
);

module.exports = router;