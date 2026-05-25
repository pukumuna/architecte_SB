// vérifier connexion
//let user = localStorage.getItem("user");
//sessionStorage.removeItem("logging");
// créer balise script
let script = document.createElement("script");

// IMPORTANT
script.type = "module";

if (sessionStorage.getItem("logging")){

    console.log("Utilisateur connecté");

    // charger fichier mise à jour
    script.src = "modal.js";
}
else {

    console.log("Utilisateur non connecté");

    // charger fichier normal
    script.src = "works.js";
}

// attendre chargement du fichier
script.onload = () => {

    console.log("Le fichier JS " + script.src + " est chargé");

    // ici vous pouvez lancer du code
};

// lancer réellement le chargement
document.body.appendChild(script);

