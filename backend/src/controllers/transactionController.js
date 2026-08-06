const pool = require("../database/connection");

async function criarTransacao(req, res) {

    const usuario_id = req.usuario.id;

    const {
        descricao,
        valor,
        tipo,
        categoria,
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
                categoria,
                data_transacao
            )
            VALUES
            ($1, $2, $3, $4, $5, $6)
            RETURNING *
            `,
            [
                usuario_id,
                descricao,
                valor,
                tipo,
                categoria,
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

async function listarTransacoes(req, res) {

    const usuario_id = req.usuario.id;

    try {

        const resultado = await pool.query(
            `
            SELECT *
            FROM transacoes
            WHERE usuario_id = $1
            ORDER BY data_transacao DESC
            `,
            [usuario_id]
        );

        return res.status(200).json(
            resultado.rows
        );

    } catch (erro) {

        console.error(erro);

        return res.status(500).json({
            erro: "Erro ao listar transações"
        });

    }

}

async function obterResumo(req, res) {

    const usuario_id = req.usuario.id;

    try {

        const resultado = await pool.query(
            `
            SELECT
                COALESCE(
                    SUM(
                        CASE
                            WHEN tipo = 'entrada'
                            THEN valor
                            ELSE 0
                        END
                    ),
                    0
                ) AS entradas,

                COALESCE(
                    SUM(
                        CASE
                            WHEN tipo IN ('saida', 'meta')
                            THEN valor
                            ELSE 0
                        END
                    ),
                    0
                ) AS saidas

            FROM transacoes
            WHERE usuario_id = $1
            `,
            [usuario_id]
        );

        const entradas = Number(
            resultado.rows[0].entradas
        );

        const saidas = Number(
            resultado.rows[0].saidas
        );

        return res.status(200).json({
            entradas,
            saidas,
            saldo: entradas - saidas
        });

    } catch (erro) {

        console.error(erro);

        return res.status(500).json({
            erro: "Erro ao obter resumo"
        });

    }

}

async function excluirTransacao(req, res) {

    const usuario_id = req.usuario.id;
    const { id } = req.params;

    try {

        const resultado = await pool.query(
            `
            DELETE FROM transacoes
            WHERE id = $1
            AND usuario_id = $2
            RETURNING *
            `,
            [id, usuario_id]
        );

        if (resultado.rowCount === 0) {

            return res.status(404).json({
                erro: "Transação não encontrada"
            });

        }

        return res.status(200).json({
            mensagem: "Transação excluída com sucesso"
        });

    } catch (erro) {

        console.error(erro);

        return res.status(500).json({
            erro: "Erro ao excluir transação"
        });

    }

}

async function atualizarTransacao(req, res) {

    const usuario_id = req.usuario.id;
    const { id } = req.params;

    const {
        descricao,
        valor,
        tipo,
        categoria,
        data_transacao
    } = req.body;

    try {

        const resultado = await pool.query(
            `
            UPDATE transacoes
            SET
                descricao = $1,
                valor = $2,
                tipo = $3,
                categoria = $4,
                data_transacao = $5
            WHERE
                id = $6
                AND usuario_id = $7
            RETURNING *
            `,
            [
                descricao,
                valor,
                tipo,
                categoria,
                data_transacao,
                id,
                usuario_id
            ]
        );

        if (resultado.rowCount === 0) {

            return res.status(404).json({
                erro: "Transação não encontrada"
            });

        }

        return res.status(200).json(resultado.rows[0]);

    } catch (erro) {

        console.error(erro);

        return res.status(500).json({
            erro: "Erro ao atualizar transação"
        });

    }

}

module.exports = {
    criarTransacao,
    listarTransacoes,
    obterResumo,
    excluirTransacao,
    atualizarTransacao
};