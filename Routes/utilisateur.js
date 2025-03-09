const express = require("express");
const routeur = express.Router();

const controleUtilisateur = require("../Controleurs/utilisateur");

routeur.post("/signup", controleUtilisateur.signup);
routeur.post("/login", controleUtilisateur.login);

module.exports = routeur;