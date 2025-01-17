const http = require('http');
const app = require("./app");
const { error } = require('console');

const normaliserPort = valeur => {
    const port = parseInt(valeur, 10);

    if (isNaN(port))
    {
        return valeur;
    }
    else if (port >= 0)
    {
        return port;
    }
    return false;
}

const port = normaliserPort(process.env.PORT || 4000);
app.set('port', port);

const gestionErreur = erreur => {
    if (erreur.syscall !== 'listen')
    {
        throw erreur;
    }

    const adresse = serveur.address();
    const numeroPort = typeof adresse === 'string' ? 'pipe' + adresse : 'port: ' + port;

    switch (erreur.code)
    {
        case "EACCESS":
            console.error(numeroPort + " requiert un privilège plus élevé");
            process.exit(1);
            break;
        case "ADDRINUSE":
            console.error(numeroPort + " est déjà utilisé");
            process.exit(1);
            break;
        default:
            throw erreur;
    }
}

const serveur = http.createServer(app);

serveur.on("error", gestionErreur);
serveur.on("listening", () => {
    const adresse = serveur.address();
    const numeroPort = typeof adresse === 'string' ? 'pipe' + adresse : 'port: ' + port;
    console.log("A l'écoute sur " + numeroPort);
});

serveur.listen(process.env.PORT || 4000);