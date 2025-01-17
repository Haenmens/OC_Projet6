const express = require("express");
const mongoose = require("mongoose");

const Utilisateur = require("./Modèles/Utilisateurs");
const Livre = require("./Modèles/Livres");

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


//ROUTES
app.post("/api/auth/signup", (req, res, next) => {
    delete req.body._id;
    const nouvelUtilisateur = new Utilisateur({...req.body});

    nouvelUtilisateur.save().then(() => {
        res.status(201).json({ message: "Utilisateur enregistré avec succès !"});
    }).catch((erreur) => {
        console.log(erreur);
        res.status(400).json({ erreur });
    });

    console.log("requête d'enregistrement d'utilisateur reçue : " + nouvelUtilisateur);
});

app.post("/api/auth/login", (req, res, next) => {
    console.log("requête de login reçue !");
});

app.get("/api/books", (req, res, next) => {
    console.log("requête pour les livres reçue !");
});

app.get("/api/books/:id", (req, res, next) => {
    console.log("requête pour un livre reçue !");
});

app.get("/api/books/bestrating", (req, res, next) => {
    console.log("requête pour les 3 meilleurs livres reçue !");
});

app.post("/api/books", (req, res, next) => {
    console.log("requête d'enregistrement d'un livre reçue !");
});

app.put("/api/books/:id", (req, res, next) => {
    console.log("requête de mise à jour d'un livre reçue !");
});

app.delete("/api/books/:id", (req, res, next) => {
    console.log("requête de suppression d'un livre reçue !");
});

app.post("/api/books/:id/rating", (req, res, next) => {
    console.log("requête de notation d'un livre reçue !");
});

module.exports = app;