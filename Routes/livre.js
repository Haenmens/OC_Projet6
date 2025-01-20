const express = require("express");
const routeur = express.Router();

const multer = require("../middleware/multer");
const authentification = require("../middleware/authentification")

const controlleurLivre = require("../Controlleurs/livre");

routeur.get("/bestrating", controlleurLivre.getBestRatingBooks);

routeur.get("", controlleurLivre.getBooks);

routeur.get("/:id", controlleurLivre.getBook);

routeur.post("", authentification, multer, controlleurLivre.postBook);

routeur.put("/:id", authentification, multer, controlleurLivre.putBook);

routeur.delete("/:id", authentification, controlleurLivre.deleteBook);

routeur.post("/:id/rating", authentification, controlleurLivre.postRating);

module.exports = routeur;