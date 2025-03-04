const { CLEF_JWT } = require("../constant");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const Utilisateur = require("../Modèles/Utilisateurs");

exports.signup = async (req, res, next) => {
    try 
    {
        delete req.body._id;
        nouvelUtilisateur = new Utilisateur({...req.body});

        const mdp_hash = await bcrypt.hash(nouvelUtilisateur.password, 10);
        nouvelUtilisateur.password = mdp_hash;

        await nouvelUtilisateur.save();
        res.status(200).json({ message: "Nouvel utilisateur enregistré avec succès."});
    }
    catch (erreur)
    {
        if (erreur.code === 1100)
        {
            return res.status(400).json({ message: "Cette adresse mail est déjà utilisée." });
        }
        res.status(400).json({ erreur });
    }
};

exports.login = async (req, res, next) => {
    try
    {
        const utilisateur = await Utilisateur.findOne({ email: req.body.email });
        if (!utilisateur)
        {
            return res.status(400).json({ message: "Aucun compte existant associé à cette adresse mail."});
        }

        const valide = await bcrypt.compare(req.body.password, utilisateur.password);
        if (!valide)
        {
            return res.status(400).json({ message: "Mauvaise combinaison d'email et de mot de passe."}); 
        }

        res.status(200).json({
            userId: utilisateur._id,
            token: jwt.sign({ userId: utilisateur._id }, CLEF_JWT, { expiresIn: '1h' })
        });
    }
    catch (erreur)
    {
        res.status(400).json({ erreur });
    }
};