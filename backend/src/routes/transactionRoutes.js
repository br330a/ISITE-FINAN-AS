const express = require("express");

const router = express.Router();

const autenticarToken = require(
    "../middleware/authMiddleware"
);

const {
    criarTransacao,
    listarTransacoes
} = require(
    "../controllers/transactionController"
);

router.post(
    "/",
    autenticarToken,
    criarTransacao
);

router.get(
    "/",
    autenticarToken,
    listarTransacoes
);

module.exports = router;