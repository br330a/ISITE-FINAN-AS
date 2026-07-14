require("dotenv").config();
const express = require("express");

const cors = require("cors");

const userRoutes = require("./routes/userRoutes");

const transactionRoutes = require(
    "./routes/transactionRoutes"
);

const app = express();
app.use(cors());
app.use(express.json());

app.use("/usuarios", userRoutes);

app.use(
    "/transacoes",
    transactionRoutes
);

app.get("/", (req, res) => {
    res.json({
        message: "Servidor funcionando"
    });
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});