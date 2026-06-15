const express = require("express");

const router = express.Router();

const autenticarToken = require(
    "../middleware/authMiddleware"
);

const {
    criarTransacao,
    listarTransacoes,
    obterResumo,
    excluirTransacao
} = require(
    "../controllers/transactionController"
);

router.get(
    "/resumo",
    autenticarToken,
    obterResumo
);

router.get(
    "/",
    autenticarToken,
    listarTransacoes
);

router.post(
    "/",
    autenticarToken,
    criarTransacao
);

router.delete(
    "/:id",
    autenticarToken,
    excluirTransacao
);


module.exports = router;