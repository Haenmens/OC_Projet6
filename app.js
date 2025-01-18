const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const routesUtilisateur = require("./Routes/utilisateur");
const routesLivre = require("./Routes/livre");

mongoose.connect("mongodb+srv://test_user:test_pswd@cluster0.9kp91.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    ).then(() => {
        console.log("Connection à mongodb réussie !");
    }).catch((erreur) => {
        console.log("Connection à mongodb échouée : " + erreur.message);
    });

const app = express();

//Parsing du corps des requêtes
app.use(express.json());

//CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});

//Gestion de la route des images
app.use("/images", express.static(path.join(__dirname, "images")));

//ROUTES
app.use("/api/auth", routesUtilisateur);

app.use("/api/books", routesLivre);

module.exports = app;