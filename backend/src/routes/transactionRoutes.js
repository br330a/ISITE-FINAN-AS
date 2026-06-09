const express = require("express");

const router = express.Router();

const autenticarToken = require(
    "../middleware/authMiddleware"
);

const {
    criarTransacao
} = require(
    "../controllers/transactionController"
);

router.post(
    "/",
    autenticarToken,
    criarTransacao
);

module.exports = router;