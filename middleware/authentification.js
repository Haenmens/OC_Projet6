const jwt = require("jsonwebtoken");
const { CLEF_JWT } = require("../constant");

module.exports = (req, res, next) => {
    try
    {
        const token = req.headers.authorization.split(' ')[1];
        const tokenDecode = jwt.verify(token, CLEF_JWT);
        const userId = tokenDecode.userId;
        req.auth = {
            userId: userId
        }
        next();
    }
    catch (erreur)
    {
        console.log(erreur);
        res.status(403).json({ erreur });
    }
}