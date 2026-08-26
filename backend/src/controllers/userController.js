const pool = require("../database/connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function criarUsuario(req, res) {

    const { nome, email, senha } = req.body;
    const senhaHash = await bcrypt.hash(senha, 10);

    try {

        const resultado = await pool.query(
            `
            INSERT INTO usuarios
            (nome, email, senha)
            VALUES ($1, $2, $3)
            RETURNING id, nome, email
            `,
            [nome, email, senhaHash]
        );

        return res.status(201).json(resultado.rows[0]);

    } catch (erro) {

        console.error(erro);

        if (erro.code === "23505") {

            return res.status(400).json({
                erro: "Este email já está cadastrado"
            });

        }

        return res.status(500).json({
            erro: "Erro interno do servidor"
        });

    }
}


async function login(req, res) {

    const { email, senha } = req.body;

    try {

        const resultado = await pool.query(
            `
            SELECT *
            FROM usuarios
            WHERE email = $1
            `,
            [email]
        );

        if (resultado.rows.length === 0) {

            return res.status(401).json({
                erro: "Email ou senha inválidos"
            });

        }

        const usuario = resultado.rows[0];

        const senhaValida = await bcrypt.compare(  //função de comparação com correta e input
            senha,
            usuario.senha
        );

        if (!senhaValida) {

            return res.status(401).json({
                erro: "Email ou senha inválidos"
            });

        }

        const token = jwt.sign(
            {
                id: usuario.id,
                email: usuario.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        return res.status(200).json({
            message: "Login realizado com sucesso",
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            }
        });

    } catch (erro) {

        console.error(erro);

        return res.status(500).json({
            erro: "Erro interno"
        });

    }

}


module.exports = { //rodando
    criarUsuario,
    login
};