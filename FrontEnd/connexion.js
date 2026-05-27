
// Verifier que Email/Password saisis correspond credential/Adminstrateur
//console.log("Code connexion"); 

const formulaire = document.getElementById("formule");
formulaire.addEventListener("submit", async function(event) {
    
    event.preventDefault(); // Empêche le comportement par défaut du formulaire
    
    // Récupération des valeurs des champs et Recherhe user/Token
    let emel = document.getElementById("email").value.trim();
    let passwd = document.getElementById("passwd").value.trim();

    //console.log("coucou:" + emel + " " + passwd); 
                
    try {
        let user = await fetch("http://localhost:5678/api/users/login", { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({email: emel, password: passwd })
        }); //fin du fetch
                        
        if (user.ok) {
            let userLogin = await user.json(); // Parse JSON
            console.log("Token Login: " + userLogin.token);
            // Stockage de token 
            sessionStorage.setItem("logging", userLogin.token); // User connecté
            window.location.href = "index.html";       
        } else {
            window.localStorage.removeItem('works');  // User non connecté
            errorMessage.classList.remove("vert");
            errorMessage.classList.add("rouge");
            erreur("Erreur dans l'indetifiant ou le mot de passe"); 
        }
    }   catch (error) {
        window.localStorage.removeItem('works');  // User non connecté
        errorMessage.classList.remove("vert");
        errorMessage.classList.add("rouge");
        erreur("Erreur inattendue !!! :" + error); 
    }
});

function erreur(message) {
    errorMessage.textContent = message; 
}
///

document.getElementById("menuIndex").addEventListener("click", (event) => {

    event.preventDefault(); //car herf="#" au depart

    sessionStorage.removeItem("logging");

    window.location.href = "index.html";
});

/////////////////////