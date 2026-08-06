const pool = require("../database/connection");

async function criarMeta(req, res) {

    const usuario_id = req.usuario.id;

    const {
        nome,
        objetivo,
        valor_atual
    } = req.body;

    try {

        const resultado = await pool.query(
            `
            INSERT INTO metas
            (
                usuario_id,
                nome,
                objetivo,
                valor_atual
            )
            VALUES
            ($1, $2, $3, $4)
            RETURNING *
            `,
            [
                usuario_id,
                nome,
                objetivo,
                valor_atual ?? 0
            ]
        );

        return res.status(201).json(resultado.rows[0]);

    } catch (erro) {

        console.error(erro);

        return res.status(500).json({
            erro: "Erro ao criar meta"
        });

    }

}

async function listarMetas(req, res) {

    const usuario_id = req.usuario.id;

    try {

        const resultado = await pool.query(
            `
            SELECT *
            FROM metas
            WHERE usuario_id = $1
            ORDER BY id
            `,
            [usuario_id]
        );

        return res.status(200).json(resultado.rows);

    } catch (erro) {

        console.error(erro);

        return res.status(500).json({
            erro: "Erro ao listar metas"
        });

    }

}

async function atualizarMeta(req, res) {

    const usuario_id = req.usuario.id;

    const { id } = req.params;

    const {
        nome,
        objetivo,
        valor_atual
    } = req.body;

    try {

        const resultado = await pool.query(
            `
            UPDATE metas
            SET
                nome = $1,
                objetivo = $2,
                valor_atual = $3
            WHERE
                id = $4
                AND usuario_id = $5
            RETURNING *
            `,
            [
                nome,
                objetivo,
                valor_atual,
                id,
                usuario_id
            ]
        );

        if (resultado.rowCount === 0) {

            return res.status(404).json({
                erro: "Meta não encontrada"
            });

        }

        return res.status(200).json(resultado.rows[0]);

    } catch (erro) {

        console.error(erro);

        return res.status(500).json({
            erro: "Erro ao atualizar meta"
        });

    }

}

async function excluirMeta(req, res) {

    const usuario_id = req.usuario.id;

    const { id } = req.params;

    try {

        const resultado = await pool.query(
            `
            DELETE FROM metas
            WHERE
                id = $1
                AND usuario_id = $2
            RETURNING *
            `,
            [
                id,
                usuario_id
            ]
        );

        if (resultado.rowCount === 0) {

            return res.status(404).json({
                erro: "Meta não encontrada"
            });

        }

        return res.status(200).json({
            mensagem: "Meta excluída com sucesso"
        });

    } catch (erro) {

        console.error(erro);

        return res.status(500).json({
            erro: "Erro ao excluir meta"
        });

    }

}

module.exports = {

    criarMeta,
    listarMetas,
    atualizarMeta,
    excluirMeta

};