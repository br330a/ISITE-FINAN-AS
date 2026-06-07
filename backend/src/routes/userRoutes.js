const express = require("express");

const router = express.Router();

const {
    criarUsuario,
    login
} = require("../controllers/userController");

router.post("/", criarUsuario);
router.post("/login", login);

module.exports = router;