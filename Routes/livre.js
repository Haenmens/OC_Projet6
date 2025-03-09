const express = require("express");
const routeur = express.Router();

const multer = require("../Middleware/multer");
const authentification = require("../Middleware/authentification")

const controlleurLivre = require("../Controleurs/livre");

routeur.get("/bestrating", controlleurLivre.getBestRatingBooks);

routeur.get("", controlleurLivre.getBooks);

routeur.get("/:id", controlleurLivre.getBook);

routeur.post("", authentification, multer, controlleurLivre.postBook);

routeur.put("/:id", authentification, multer, controlleurLivre.putBook);

routeur.delete("/:id", authentification, controlleurLivre.deleteBook);

routeur.post("/:id/rating", authentification, controlleurLivre.postRating);

module.exports = routeur;