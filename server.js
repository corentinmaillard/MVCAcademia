const { response } = require('express');

let express = require('express'); //imp express

let app = express(); //initialise l'app

let rooter = require("./routes");

let mysql = require('mysql');

let tricks = false;

let idCheck = [0,0,0] //initialisation de ma variable (utiliser pour verfier qu'il n'y aient pas 2fois la même formation)

let listCatalogue = []; //créer une liste vide

let cookieParser = require('cookie-parser')//initialise le midlleware

let session = require('express-session'); //initialise la session et utilise le midlleware express-session

const { redirect } = require('express/lib/response');
const res = require('express/lib/response');
const req = require('express/lib/request');

app.use(express.urlencoded( { extended : true}));

app.use(cookieParser());

app.use(express.static('public')); //pour ouvrir le dossier css

/*secret: 'my secret' => génère une clef unique pour une session
resave: false => pour dire que l'on ne veut pas recréer de clef lors d'une sauvegarde ultérieure
saveUninitialized: true => savoir si on veut concerver une session vide ou pas*/
app.use(session({
    secret: 'my secret',  
    resave: false,
    saveUninitialized: true
}));

app.use('/',rooter);

app.listen(80, function() {
    console.log('Running on port 80');
});