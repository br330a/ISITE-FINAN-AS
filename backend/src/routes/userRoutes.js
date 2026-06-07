const express = require("express");

const router = express.Router();

const {
    criarUsuario
} = require("../controllers/userController");

router.post("/", criarUsuario);

module.exports = router;