const Livre = require("../Modèles/Livres");

exports.getBooks = async (req, res, next) => {
    try 
    {
        const livres = await Livre.find();
        res.status(200).json(livres);
        console.log(livres);
    }
    catch (erreur)
    {
        res.status(500).json(erreur);
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
        res.status(400).json(erreur);
    }
};

exports.getBestRatingBooks = (req, res, next) => {
    console.log("requête pour les 3 meilleurs livres reçue !");
};

exports.postBook = (req, res, next) => {
    const nouveauLivre = new Livre({...JSON.parse(req.body.book)});
    
    nouveauLivre.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    
    nouveauLivre.save().then(() => {
        res.status(200).json({ message: "Nouveau livre ajouté avec succès !"});
    }).catch((erreur) => {
        res.status(400).json(erreur);
    });
};

exports.putBook = (req, res, next) => {
    console.log("requête de mise à jour d'un livre reçue !");
};

exports.deleteBook = (req, res, next) => {
    console.log("requête de suppression d'un livre reçue !");
};

exports.postRating = (req, res, next) => {
    console.log("requête de notation d'un livre reçue !");
};