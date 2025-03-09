const Livre = require("../Modèles/Livres");
const fs = require("fs");
const sharp = require("sharp");
const Livres = require("../Modèles/Livres");

exports.getBooks = async (req, res, next) => {
    try 
    {
        const livres = await Livre.find();
        res.status(200).json(livres);
    }
    catch (erreur)
    {
        res.status(400).json({ erreur });
    }
};

exports.getBook = async (req, res, next) => {
    try 
    {
        const livre = await Livre.findOne({_id: req.params.id});

        if (!livre)
        {
            return res.status(400).json({message: "Aucun livre avec cet id n'a été trouvé."});
        }

        res.status(200).json(livre);
    }
    catch (erreur)
    {
        res.status(400).json({ erreur });
    }
};

exports.getBestRatingBooks = async (req, res, next) => {
    try
    {
        const livres = await Livre.find({});
        meilleursLivres = livres.sort((livreA, livreB) => livreB.averageRating - livreA.averageRating).slice(0, 3);
        res.status(200).json(meilleursLivres);
    }
    catch (erreur)
    {
        res.status(400).json({ erreur });
    }
};

exports.postBook = async (req, res, next) => {
    try
    {
        const nouveauLivre = new Livre({...JSON.parse(req.body.book)});

        if (req.file === undefined) return res.status(400).json({ message: "Image manquante ou mauvais format" });

        fs.access("./images", (erreur) => {
            if (erreur)
            {
                fs.mkdirSync("./images");
            }
        });
        const { buffer, originalname } = req.file;
        date = new Date().toISOString().replace(/:/g, "-");
        const nouveauNom = `${originalname}-${date}.webp`
                            .replace(/[\/\\:*?"<>| ]/g, "_") //Caractères interdits
                            .trim()                          //Espaces début et fin
                            .substring(0, 255);              //Taille max 255
        await sharp(buffer).webp({ quality: 75 }).toFile("./images/" + nouveauNom);

        nouveauLivre.imageUrl = `${req.protocol}://${req.get('host')}/images/${nouveauNom}`;

        await nouveauLivre.save();

        res.status(200).json({ message: "Nouveau livre ajouté avec succès !"});
    }
    catch (erreur)
    {
        res.status(400).json({ erreur });
    }
};

exports.putBook = async (req, res, next) => {
    try {
        if (req.body.book !== undefined)
        {
            const { buffer, originalname } = req.file;
            date = new Date().toISOString().replace(/:/g, "-");
            const nouveauNom = `${originalname}-${date}.webp`
                                .replace(/[\/\\:*?"<>| ]/g, "_") //Caractères interdits
                                .trim()                          //Espaces début et fin
                                .substring(0, 255);              //Taille max 255
            await sharp(buffer).webp({ quality: 75 }).toFile("./images/" + nouveauNom);
            const livre = await Livres.findOne({ _id: req.params.id });
            nomImage = livre.imageUrl.split("/").pop();
            fs.unlink("./images/" + nomImage, (erreur) => {
                if (erreur)
                {
                    return res.status(400).json(erreur);
                }
            });
            livreMisAJour = {
                ...JSON.parse(req.body.book),
                imageUrl: `${req.protocol}://${req.get('host')}/images/${nouveauNom}`
            };
        }
        else
        {
            livreMisAJour = {...req.body};
        }
        if (livreMisAJour.userId != req.auth.userId)
        {
            return res.status(403).json({ message: "Requête non autorisée" });
        }
        delete livreMisAJour._id;
        await Livre.updateOne({ _id: req.params.id }, livreMisAJour);
        res.status(200).json({ message: "Le livre a bien été mis à jour !" });
    }
    catch (erreur)
    {
        res.status(400).json({ erreur });
    }
};

exports.deleteBook = async (req, res, next) => {
    try 
    {
        const livre = await Livre.findOne({_id: req.params.id});

        if (livre.userId != req.auth.userId)
        {
            return res.status(403).json({ message: "Requête non autorisée" });
        }

        nomImage = livre.imageUrl.split("/").pop();
        fs.unlink("./images/" + nomImage, (erreur) => {
            if (erreur)
            {
                return res.status(400).json(erreur);
            }
        });
        await Livre.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: "Le livre a bien été supprimé !" });
    }
    catch (erreur) 
    {
        res.status(400).json({ erreur });
    }
};

exports.postRating = async (req, res, next) => {
    if (req.body.rating < 0 || req.body.rating > 5) return res.status(400).json({message: "La note n'est pas comprise entre 0 et 5"});

    try
    {
        livreANoter = await Livre.findOne({_id: req.params.id});

        if (livreANoter.ratings.find((note) => note.userId === req.body.userId) !== undefined)
        {
            return res.status(400).json({ message: "Ce compte a déjà attribué une note à ce livre." });
        }

        livreANoter.ratings.push({userId: req.body.userId, grade: req.body.rating});
        moyenne = 0;
        livreANoter.ratings.forEach(note => {
            moyenne += note.grade;
        });
        moyenne /= livreANoter.ratings.length;
        livreANoter.averageRating = moyenne;

        delete livreANoter._id;
        await Livre.updateOne({ _id: req.params.id }, livreANoter);
        
        livre = await Livre.findOne({ _id: req.params.id });
        res.status(200).json(livre);
    }
    catch (erreur)
    {
        res.status(400).json({ erreur });
    }
};