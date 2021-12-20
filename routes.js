const { Router } = require('express');
let express = require('express'); //imp express

let rooter = express.Router(); //initialise rooter

let session = require('express-session'); //initialise la session et utilise le midlleware express-session
const { route } = require('express/lib/application');

let catalogue = require('./controlleur/catalogue.js');

rooter.get('/', catalogue.PageFormation);
rooter.get('/connect', catalogue.Connexion);
rooter.get('/connect/:user', catalogue.Pseudo);
rooter.get('/basket', catalogue.Basket);
rooter.get('/basket/:i',catalogue.BasketRemove);
rooter.get('/redirect', catalogue.UserRedirect);
rooter.post('/redirect', catalogue.UserRedirectUrl);
rooter.get('/redirect/:user', catalogue.UserSession);
rooter.get('/update', catalogue.UserUpdate);
rooter.get('/update/:i', catalogue.ListFormation);
rooter.post('/connect', catalogue.UserConnect);

module.exports = rooter;