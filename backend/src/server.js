require("dotenv").config();
const express = require("express");

const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(express.json());

app.use("/usuarios", userRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Servidor funcionando"
    });
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});