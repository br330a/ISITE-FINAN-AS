const pool = require("../database/connection");

async function criarTransacao(req, res) {

    const usuario_id = req.usuario.id;

    const {
        descricao,
        valor,
        tipo,
        data_transacao
    } = req.body;

    try {

        const resultado = await pool.query(
            `
            INSERT INTO transacoes
            (
                usuario_id,
                descricao,
                valor,
                tipo,
                data_transacao
            )
            VALUES
            ($1, $2, $3, $4, $5)
            RETURNING *
            `,
            [
                usuario_id,
                descricao,
                valor,
                tipo,
                data_transacao
            ]
        );

        return res.status(201).json(
            resultado.rows[0]
        );

    } catch (erro) {

        console.error(erro);

        return res.status(500).json({
            erro: "Erro ao criar transação"
        });

    }

}

module.exports = {
    criarTransacao
};