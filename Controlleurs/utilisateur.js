const { CLEF_JWT } = require("../constant");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const Utilisateur = require("../Modèles/Utilisateurs");

exports.signup = (req, res, next) => {
    delete req.body._id;
    nouvelUtilisateur = new Utilisateur({...req.body});

    bcrypt.hash(nouvelUtilisateur.password, 10).then((mdp_hash) => {
        nouvelUtilisateur.password = mdp_hash;

        nouvelUtilisateur.save().then(() => {
            res.status(201).json({ message: "Utilisateur enregistré avec succès !"});
        }).catch((erreur) => {
            let status = 400;

            if (erreur.code === 11000)
            {
                status = 409;
            }
            
            res.status(400).json({ erreur });
        });
    });
};

exports.login = (req, res, next) => {
    Utilisateur.findOne({ email: req.body.email }).then((utilisateur) => {
        if (!utilisateur)
        {
            return res.status(400).json({ message: "Aucun compte existant associé à cette adresse mail."});
        }

        bcrypt.compare(req.body.password, utilisateur.password).then((valide) => {
            if (!valide)
            {
                return res.status(400).json({ message: "Mauvaise combinaison d'email et de mot de passe."}); 
            }

            res.status(200).json({
                userId: utilisateur._id,
                token: jwt.sign({ userId: utilisateur._id }, CLEF_JWT, { expiresIn: '1h' })
            });
        }).catch((erreur) => {
            return res.status(500).json({ erreur });
        });
    }).catch((erreur) => {
        return res.status(500).json({ erreur });
    });
};