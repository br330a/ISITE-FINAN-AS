const express = require("express");

const router = express.Router();

const autenticarToken = require("../middleware/authMiddleware");

const {

    criarMeta,
    listarMetas,
    atualizarMeta,
    excluirMeta

} = require("../controllers/metaController");


router.use(autenticarToken);


router.post("/", criarMeta);

router.get("/", listarMetas);

router.put("/:id", atualizarMeta);

router.delete("/:id", excluirMeta);


module.exports = router;