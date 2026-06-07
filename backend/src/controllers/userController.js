const pool = require("../database/connection");

const bcrypt = require("bcrypt");

async function criarUsuario(req, res) {

    const { nome, email, senha } = req.body;
    const senhaHash = await bcrypt.hash(senha, 10);

    try {

        const resultado = await pool.query(
            `
            INSERT INTO usuarios
            (nome, email, senha)
            VALUES ($1, $2, $3)
            RETURNING *
            `,
            [nome, email, senhaHash]
        );

        return res.status(201).json(resultado.rows[0]);

    } catch (erro) {

        console.error(erro);

        return res.status(500).json({
            erro: "Erro ao criar usuário"
        });

    }
}



module.exports = {
    criarUsuario
};