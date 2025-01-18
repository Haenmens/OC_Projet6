const express = require("express");
const routeur = express.Router();

const multer = require("../config/multer")

const controlleurLivre = require("../Controlleurs/livre");

routeur.get("", controlleurLivre.getBooks);

routeur.get("/:id", controlleurLivre.getBook);

routeur.get("/bestrating", controlleurLivre.getBestRatingBooks);

routeur.post("", multer, controlleurLivre.postBook);

routeur.put("/:id", controlleurLivre.putBook);

routeur.delete("/:id", controlleurLivre.deleteBook);

routeur.post("/:id/rating", controlleurLivre.postRating);

module.exports = routeur;