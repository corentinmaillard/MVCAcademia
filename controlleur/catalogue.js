const { response } = require('express');

let mysql = require('mysql');

let tricks = false;

let idCheck = [0,0,0] //initialisation de ma variable (utiliser pour verfier qu'il n'y aient pas 2fois la même formation)

let listCatalogue = []; //créer une liste vide

let connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'users'
});
// on prend toutes la table de catalogue et on l'envoie à userList.ejs
exports.PageFormation = function (require, response){
    connection.query("select * from catalogue;", function(error, result){
        if(error) console(error);
        response.render('userList.ejs', {catalogues: result, trick : tricks});
        tricks= false;
    });
};

//redirige sur la page connect
exports.Connexion= function (require, response){
    response.render('userConnect.ejs');
};

//Energistre dans la session le user qui a été mit dans l'url
exports.Pseudo= function (require, response){
    require.session.user = require.params.user;
    console.log(require.session);
    response.redirect('/')
};

//redirige sur la page basket et utilise la liste listCatalogue pour créer le tableau.
exports.Basket= function (require, response){
    response.render('userBasket.ejs', {lists: listCatalogue});
};

//supprime l'élément i de la liste
exports.BasketRemove= function (require, response){
    let i = require.params.i;
    listCatalogue.splice(i, 1);
    response.redirect("/basket");
};

exports.UserRedirect= function (require, response){
    if (require.session.user === undefined) { //si utilisateur non connecter
        response.render('userRedirect.ejs');
    }
    else { //aussi non
        tricks = true;
        let maListe = listCatalogue;
        idCheck = [0,0,0];
        for (let i = 0 ; i < maListe.length ; i++){ //boucle pour ajouter les formations et l'utilisateur au panier de la database
            connection.query("INSERT INTO panier set ?;",{"pseudo":require.session.user,"idformation":maListe[i][0]}); //ajoute dans le tableau panier le pseudo et l'idformation
        };
        listCatalogue.splice(0, listCatalogue.length); //vide la liste
        response.redirect('/'); //redirige vers l'url /user
    }
};

//Met le pseudo dans l'url pour que se faire enregistrer plus bas en session et l'enregistre dans la base de donné
exports.UserRedirectUrl= function (require, response){
    let userSession2 = require.body.myname2;
    connection.query('INSERT INTO utilisateur SET ?;', {"pseudo":userSession2} ,function(err, result) {
        if(err) console.log(err);
        response.redirect('/redirect/'+userSession2);
    });  
};

//Energistre dans la session le user qui a été mit dans l'url
//Rajoute le panier dans le tableau panier qui va lier le numero de la formation du catalogue avec l'utilisateur
//Redirige ensuite sur la première page
exports.UserSession= function (require, response){
    console.log(require.params.user);
    require.session.user = require.params.user;
    tricks = true;
    idCheck = [0,0,0];
    let maListe = listCatalogue; 
    for (let i = 0 ; i < maListe.length ; i++){ //boucle pour ajouter les formations et l'utilisateur au panier de la database
        connection.query("INSERT INTO panier set ?;",{"pseudo":require.session.user,"idformation":maListe[i][0]}); //ajoute dans le tableau panier le pseudo et l'idformation
    };
    listCatalogue.splice(0, listCatalogue.length); //vide la liste
    response.redirect('/'); //redirige vers l'url /user
};

exports.UserUpdate= function (require, response){
    response.render('userUpdate.ejs');
};

//recupere la liste des information du tableau catalogue grace a l'id
//pour lequel on s'est inscrit et l'ajoute a la fin de la liste listeCatalogue
exports.ListFormation= function (require, response){
    let i = require.params.i;
    if (idCheck[i-1]==0){ //vérifie que l'utilisateur n'est pas déjà inscript
        connection.query("select * from catalogue WHERE idcatalogue = ?;", i , function(error, result){ //se connecte a la base de donné pour allez rechercher tout les élémént de catalogue correspondant a l'idcatalogue choisi
            if(error) console(error);
            let myListe = [result[0].idcatalogue,result[0].Nom,result[0].Prix,result[0].Début,result[0].Fin] //créer une liste contenant les éléments de catalogue correspandent à la ligne a laquelle on a cliqué sur s'inscrire
            listCatalogue.push(myListe);//ajoute myListe à la fin de la liste listCatalogue
            idCheck[i-1]=1; //On change la valeur 0 pour que l'utilisateur ne s'inscrive pas plusieurs fois à la même formations
            console.log(require.session);
            response.redirect('/');
        });
    }
    else response.redirect('/');
};

//Met le pseudo dans l'url pour que se faire enregistrer plus bas en session
exports.UserConnect= function (require, response){
    let userSession = require.body.myname;
    connection.query('INSERT INTO utilisateur SET ?;', {"pseudo":userSession} ,function(err, result) { //enregistre le pseudo de la session dans le tableau utilisateur
        if(err) console.log(err);
        response.redirect('/connect/'+userSession); 
    });  
};



