// Script pour contrôler les données du formulaire
let userAdmin = "";
let wlstUser = "";
let user = "";
async function initAdmin() {   

    //Récupération du Token de l'Administrateur eventuellement du localStorage
    window.localStorage.removeItem('user');
    wlstUser = window.localStorage.getItem("user");
    if (!JSON.parse(wlstUser) ||
        !JSON.parse(wlstUser).token) { // Persister User Administrateur dans localStorage  
        // Récupération du token de l'Adminitrateur depuis l'API
        // body: '{"email": "sophie.bluel@test.tld" , "password": "S0phie"} 
          
        user = await fetch("http://localhost:5678/api/users/login", {       
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ email: "sophie.bluel@test.tld", password: "S0phie" })
        }); 
         
        userAdmin = await user.json(); // Parse JSON en Objets Javascript 
        
        wlstUser = JSON.stringify(userAdmin); // Transformation de user en JSON
        //onsole.log("userAdmin : " + userAdmin + " token  : " + userData.token); 
        // Stockage des informations dans le localStorage (sorte de sauvegarde light)
        window.localStorage.setItem("user", wlstUser);
    }    
    /*
    userAdmin = JSON.parse(window.localStorage.getItem("user"));
    console.log("user-email : " + userAdmin.email);
    console.log("user-passd : " + userAdmin.password);
    console.log("Token setItem : " + userAdmin.token); */
}    

// Verifier que Email/Password saisis correspond credential/Adminstrateur
console.log("Code connexion"); 

const formulaire = document.getElementById("formule");
formulaire.addEventListener("submit", async function(event) {
    
    event.preventDefault(); // Empêche le comportement par défaut du formulaire

    console.log("gamin dejeu gamin");
     
    initAdmin(); // userAdmin:en string
    //userAdmin = JSON.parse(window.localStorage.getItem("user")); //Recup de userAdmin
    userAdmin = JSON.parse(wlstUser);

    let emel = "";
    let passwd = "";
    let userLogin = "";  
    
    // Récupération des valeurs des champs et Recherhe user/Token
    emel = document.getElementById("email").value.trim();
    passwd = document.getElementById("passwd").value.trim();

    console.log("coucou:" + emel + " " + passwd); 
    
    user = await fetch("http://localhost:5678/api/users/login", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({email: emel, password: passwd })
    }); 
    userLogin = await user.json(); // Parse JSON

    if (userLogin.token == null) {
        erreur("Accès refusé. Email ou mot de passe invalide.");
    } else {
        
        //Teste de token sur les 80 premiers caracteres
        const tokenAdmin = userAdmin.token.substring(0, 50);
        const tokenLogin = userLogin.token.substring(0, 50);
        console.log("Token Admin: " + tokenAdmin);  
        console.log("Token Login: " + tokenLogin);

        if (tokenAdmin === tokenLogin) { // Verif Tokens
            console.log("Token Login =:")
            // Si les informations sont valides, redirige vers la page index.html
            window.location.href = "indModal.html";
        } else {
        // Sinon, affiche un message d'erreur
            erreur("Email ou mot de passe invalide. Veuillez réessayer.");
        } 
    }
});

function erreur(message) {
    document.getElementById("errorMessage").textContent = message; 
}
