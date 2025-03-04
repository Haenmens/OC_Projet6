const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const routesUtilisateur = require("./Routes/utilisateur");
const routesLivre = require("./Routes/livre");
const { ADRESSE_BDD } = require("./constant.js");

mongoose.connect(ADRESSE_BDD
    ).then(() => {
        console.log("Connection à mongodb réussie !");
    }).catch((erreur) => {
        console.log("Connection à mongodb échouée : " + erreur.message);
    });

const app = express();
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/auth", routesUtilisateur);
app.use("/api/books", routesLivre);

module.exports = app;