import { chargerWorks, chargerCategories } from "./acces.js";

let isrtCateg = [];
let menuLog = document.getElementById("menuIndex");

let modEntete = document.querySelector(".modEntete");
modEntete.innerHTML = `
        <div class="modEdit">
		    <i class="fas fa-edit"></i>
		    <span id="spanEdit">Mode édition</span>
	    </div>
    `;

let maxGalery = document.querySelector(".maxGallery");    
    
const boiteModal = document.getElementById("boiteModal"); 

//Variable Gallerie et icone
let works;
const galery = document.querySelector(".popup-grid1");      
const uploadSection = document.querySelector('.upload-section');
const fileInput = document.getElementById("fileImg");


// Traitement de la saisie Ajout Photo des Projets 
const titleInput = document.getElementById("title");
const statous    = document.getElementById("statous");
//const fileInput  = document.getElementById("fileImg");
const chargList  = document.querySelector("#lstcateg");

const submitBtn  = document.getElementById("submitBtn");
const errorMessage = document.getElementById("errorMessage");

/* ================================================================= */



// ----------------Fin interpolation de ajout dynamique menuLOg * Aside pour popup -----------------//

//Récupération des categories eventuellement stockées dans le localStorage
async function misefTravaux() {

   await chargerWorks();
    
   works = JSON.parse(localStorage.getItem("works"));
   console.log("Test works local store : " + works[0].title);
   afficherGalery(works); 
}

misefTravaux();


chargerCategories();

let categories =  JSON.parse(window.localStorage.getItem('categories'));

//afficherGalery();

//-------------------------------------- Functions -------------------------------//

//Affichage dynamique de la liste des Travaux de Architecte
function afficherGalery() {
    
    maxGalery.innerHTML = ``;
      
    for (let i=0; i < works.length; i++) {
        //if (i === idel) { continue; }
        const projet = works[i];
        const figure = document.createElement("figure");
        const image  = document.createElement("img");
        const caption = document.createElement("figcaption");
        image.src=projet.imageUrl;
        image.alt=projet.title; 
        caption.innerText=projet.title;
        caption.classList.add("titrImage");
        figure.appendChild(image); 
        figure.appendChild(caption);

        maxGalery.appendChild(figure);
    }
}

     
    /* ----------------------------------------------------------------*/
    /* ----------------------  MEF UPload Photo    --------------------*/ 
    /* ----------------------------------------------------------------*/  

function initloadImg() {  //Init du bloc pour load img + Titre + catégorie

    //console.log("Initialisation du cadre de loading photo !!!");
    
    document.querySelector(".popup-content2 #title").value = "";
    document.querySelector(".popup-content2 #statous").textContent  = "";
            //document.querySelector(".popup-content2 #fileImg").value = "";
    document.querySelector(".popup-content2 #lstcateg").value = "";
    document.querySelector(".popup-content2 #errorMessage").textContent  = "";

    document.querySelector("#submitBtn").classList.remove("enabled");
    document.querySelector("#submitBtn").classList.add("remplir");

    fileInput.value = ""; 
    fileInput.addEventListener("change", handleFileChange); 

}

function chargtCategories() {                 // 19/03/26  

    //Basile Select : chargList - à charger par <option> % base "categories"
     
    for (let i=0; i < categories.length; i++) {
        let option = document.createElement("option");
        option.innerText = categories[i].name;
        chargList.appendChild(option);
    } 
 }

function chargtPopupGrid1() {

    galery.innerHTML = "";  // 05-03-26
 
    //console.log("chargement des images miniatures stockées dans table interne"); 
  
    for (let i=0; i < works.length; i++) {
        const projet = works[i];
        const figure = document.createElement("div");
        figure.classList.add("divrelate");
        
        const image = document.createElement("img");
        image.setAttribute("object-fit","cover");
        image.src=projet.imageUrl;
            
        const icone = document.createElement("i");
        icone.setAttribute("workid",`${projet.id}`);
        icone.classList.add("fas", "fa-trash-can", "trash-icon");
        const icodiv = document.createElement("div");
        icodiv.classList.add("divicone");
        icodiv.appendChild(icone);
        figure.appendChild(image);
        figure.appendChild(icodiv);
        galery.appendChild(figure);
        //console.log("rang de image chargée :" + i + " et " + projet.id);
            
        icone.addEventListener("mouseover", (event) => {
            // highlight the mouseenter target
            event.target.style.color = "purple";
            // reset the color after a short delay
            setTimeout(() => {
            event.target.style.color = ""; }, 300);
        }); // fin de icone "mouseover"          

        icone.addEventListener("click", async () => {
            alert('Image supprimée !');
            const id = icone.getAttribute("workid");
            figure.remove(); // Suppression du conteneur
            
            const userData = window.localStorage.getItem('user')
            //const token = JSON.parse(userData).token;
            let token = sessionStorage.getItem("logging");
            console.log("token du delete : " + token);
            
            try {
                const response = await fetch(`http://localhost:5678/api/works/${id}`, {
                    method: "DELETE",
                    headers: { 
                         'Authorization': `Bearer ${token}`,
                         'Content-Type': 'application/json'
                    }
                }); //fin du fetch
           
                console.log("Reponse du delete : " + response);
                             
                if (response.ok) {
                    statous.textContent = "Delete effectué avec succès !";
                    statous.style.color = "green";
                    console.log("Reponse du delete-OK : " + response.ok);       
                 } else {
                    statous.textContent = "Erreur lors de delete work";
                    statous.style.color = "red";
                    console.log("Reponse du delete-KO : " + response.status);
                }
            }   catch (error) {
                statous.textContent = "Erreur : " + errorMessage;
                statous.style.color = "red";
                console.log("Reponse du delete-Other");
            }
             
            // Suppression de élément du tableau works
            console.log("Avant slice longueur works : " + works.length);
            let workTab = works.filter(work => work.id != id);

            console.log("Après slice longueur works : " + workTab.length);
            works = workTab;
            afficherGalery(); 
        }); //fin de icone "click" 
            
        const body = document.querySelector("body");
        boiteModal.style.visibility = "visible";  
        boiteModal.scrollTop = boiteModal.scrollHeight;  
        body.style.backgroundColor = "rgba(0, 0, 0, 0.3)";  
        boiteModal.focus();         
    } 
    
} 


// Définition de la fonction controleData ------------------*
function controleData() {
    let categorie = [];
    let file  = fileInput.files[0] ;
    
    let title = titleInput.value.trim();
    
    //const erroreMessage  = document.querySelector("#uploadForm p");
    // Vérification du fichier
    
    let isValid = true;
    let messErreur = [];
    let option = document.querySelector("#lstcateg"); // value categ cliquée
    statous.textContent = '';
    errorMessage.textContent = '';

     // Vérification de fichier
    if (!file) {
        isValid = false;
        messErreur.push('Veuillez sélectionner une image');
    } 

    // Vérification du titre
    if (isValid && !title) {
        isValid = false;
        messErreur.push('Le titre ne peut pas être vide.');
    }
   
   // Vérification de categorie
    if (isValid && ! option.value)  { 
        isValid = false;
        messErreur.push("La categorie ne peut pas être vide.");
    }   else {
        categorie.name = option.value;
    } 

    
    // Mise à jour du message d'erreur
    if (! isValid) {
        errorMessage.classList.add("rouge");
        errorMessage.classList.remove("vert");
        errorMessage.textContent = messErreur.join(); 
        submitBtn.classList.remove("enabled");
        submitBtn.classList.add("remplir");
        console.log("submitBtn au rouge !!!");
    } else {
        console.log("submitBtn au green !!!");
        submitBtn.classList.remove("remplir");
        submitBtn.classList.add("enabled"); 
        statous.textContent = "Appuyez sur Valider pour insérer";
        errorMessage.classList.add("vert");
        errorMessage.classList.remove("rouge");
       
    }   
};
 
// Remplissage champs du formulaire : Détection de la saisie sur Titre
const titreInput = document.getElementById("title");
titleInput.addEventListener("input", () => {    // 09-02-26
    controleData();
});  


// Selection de l'image photo sur la présentation des images à l'écran
function handleFileChange(event) {  
      
    const file = event.target.files[0]; 
    //console.log("fichier - file = " + file.name + ' ' + file.type); 
    if (file && (file.size <= 4 * 1024 * 1024) &&  // taille limite 4
       (file.type === "image/jpeg" || file.type === "image/png") ) {
        const reader = new FileReader();

        reader.onload = function(event) {
            
            const img = document.createElement("img");
            img.src = event.target.result;
            //console.log("Image - src = " + event.target.result);  09-02-26
            document.querySelector(".upload-section").innerHTML = "";
            document.querySelector(".upload-section").appendChild(img);
         
        }
        reader.readAsDataURL(file); 
   
        controleData();  
            
    }   else {     
        if (!file) {
            erreur("Veuillez sélectionner une image ");
        } else {
            if (file.size > 4 * 1024 * 1024) {
                erreur("Le fichier ne doit pas dépasser 4 Mo.");
            } else {
                if (!(file.type === "image/jpeg" || file.type === "image/png")) {
                    erreur("Veuillez sélectionner une image au format JPEG ou PNG.");
            } else {
                erreur("Image non conforme, probleme inattendu !!!");
            }
        }
    }}  
}


// Affichage Message Erreur sur saisie de la Modale
function erreur(message) {
    document.getElementById("errorMessage").textContent = message; 
}
const closeModal = function (e) {
    if (boiteModal === null) return ;
    e.preventDefault();
    console.log("Tentative de fermeture de la boite modale");
    console.log("Tentative de fermeture de la boite modale");
    console.log("Tentative de fermeture de la boite modale");
    window.localStorage.removeItem('works');                                 // 20/01/25 Delete
    window.location.reload(); 
}
       
/* ---------------------------------------------------------------------------------------------*/
/* --------------------------------------- Procécures Evenementielles --------------------------*/
/* ---------------------------------------------------------------------------------------------*/
// ------------------------------------------ Gestion des Ecouteurs ----------------------------//


//--------- Click sur icone "edition" et Affichage 1ere modale: Mini Grille des Photos --------//
let edition = document.getElementById("fenetre");  
edition.addEventListener("click", (event) => { 
        //console.log("execution de la fonction modale:1"); 
        //document.querySelector(".popup-content1").classList.add("active");  10-05
        boiteModal.classList.remove("hidden");
        boiteModal.addEventListener("click", closeModal);   
        let stopModal = document.querySelector(".popup-modal-stop");
        stopModal.addEventListener("click", stopPropagation);
        //let main = document.querySelector("main");
        let body = document.querySelector("body");
        let inputa = document.querySelector("#contact textarea");
        let inputt = document.querySelector("#contact input[type='text']");
        let inputm = document.querySelector("#contact input[type='email']");
        
        //main.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
        body.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
        //inputa.style.backgroundColor = "rgba(0, 0, 0, 0.03)";
        //inputm.style.backgroundColor = "rgba(0, 0, 0, 0.03)";
        //inputt.style.backgroundColor = "rgba(0, 0, 0, 0.03)";
                
        document.querySelector(".popup-content2").classList.add("hidden");
        document.querySelector(".popup-content1").classList.remove("hidden"); // Modale devient actif

        galery.setAttribute("display","flex");
     

        chargtCategories();                                 
         
        chargtPopupGrid1();                                 
          
    
});  // Fin d'exécution de la 1er modale

const stopPropagation = function (e) { //Empeche la propagation de l'evt (vers le parent !!!)
    e.stopPropagation()
}

// <---- Passage 1er Modale a 2eme Modale par appui sur : Ajout Photo  -> //
document.querySelector(".popup-content1 .ajoutPhoto").addEventListener("click", (event) => {
    //console.log("/Split Modale Grille-1 à Ajout Photo " );
    document.querySelector(".popup-content1").classList.add("hidden");
    document.querySelector(".popup-content2").classList.remove("hidden");

    //console.log("Abordage de l'étape de chargement de(s) photo(s)");
    initloadImg();
    statous.textContent = '';
    errorMessage.textContent = '';
    document.querySelector(".popup-content2 #title").value = "";        // 12-02-26
    document.querySelector(".popup-content2 #statous").value = "";
    //document.querySelector(".popup-content2 #fileImg").value = "";
    document.querySelector(".popup-content2 #lstcateg").value = "";
    document.querySelector(".popup-content2 #errorMessage").value = ""; // 12-02-26 
    
    document.querySelector("#submitBtn").classList.remove("enabled"); // bouton submit inactif
    document.querySelector("#submitBtn").classList.add("remplir");
  
});

chargList.addEventListener("click", () => {
   
    let option = document.querySelector("#lstcateg"); // Champ de lstcateg cliqué

     console.log("Catégorie cliquéé : " + option.value);

    for (let i=0; i < categories.length; i++) {
        if (option.value === categories[i].name) {
            isrtCateg.id   = categories[i].id;
            isrtCateg.name = categories[i].name;
            break;
        }
    } 
    controleData();
 }); 
  
// Soumission des champs du formulaire et Record nouveau "work" 
let formulaire = document.getElementById("uploadForm");
formulaire.addEventListener("submit", async (event) => {

    event.preventDefault();
    //console.log("Nettoyer la zone status par textContent !!!");
    statous.textContent = ""

    if  (!submitBtn.classList.contains("enabled")) {
        errorMessage.classList.add("rouge");  
        errorMessage.classList.remove("vert");
        if (errorMessage.textContent == "") {
            errorMessage.textContent = "Remplissez correctement le formulaire avant de soumettre.";
        }
    
        return;
    }

    controleData();
    
    let userEnr = window.localStorage.getItem('user');
    let userParse = JSON.parse(userEnr);
    let useridIsrt = userParse.userId;
    //let tokenIsrt  = userParse.token;  
    let tokenIsrt  = sessionStorage.getItem("logging");
    let optCateg = document.querySelector("#lstcateg");
    let imageUrlIsrt =   fileInput.files[0].name;
    let categoryIdIsrt = isrtCateg.id
    let categoryNameIsrt = isrtCateg.name;
    
    console.log("user parse : "  + userParse);
    console.log("token Isrt : "  + tokenIsrt);
    console.log("userid Isrt : " + useridIsrt);
    console.log("title Isrt : " + titleInput.value.trim()); 
    console.log("imageUrl Isrt : " + imageUrlIsrt);       
    console.log("categoryId Isrt : " + categoryIdIsrt);
    console.log("categoryName Isrt : " + categoryNameIsrt);
    /*t objCategory = {"id":categoryIdIsrt, "name": categoryNameIsrt};
    */                                // Retabli au 21-01-26
    let fdWork = new FormData();
    //fdWork.append("id", 0);
    fdWork.append("title", titleInput.value.trim());
    //Work.append("imageUrl", fileInput.files[0].name); // 21-01-26
    fdWork.append("image", fileInput.files[0]);
    fdWork.append("category", categoryIdIsrt);
     
    console.log("Insertion work avec Post");
   
    try {
      const response = await fetch("http://localhost:5678/api/works/", {
        method: "POST",
        headers: { "Authorization": `Bearer ${tokenIsrt}` },
        body: fdWork      
      });
      
      if (response.ok) {
        statous.textContent = "Fichier enregistré avec succès !";
        statous.style.color = "green";
        initloadImg();
        fileInput.value = ""; 
        console.log("user parse : "  + "passe 1");
      } else {
        statous.textContent = "Erreur lors de l'enregistrement.";
        statous.style.color = "red";
        console.log("user parse : "  + "passe 2");
        //console.log("Erreur d'insertion :" +response.status);
      }
    } catch (error) {
      statous.textContent = "Erreur : " + errorMessage.textContent ;
      statous.style.color = "red";
      console.log("Erreur détectée :", error);
      console.log("Message erreur :", errorMessage.textContent);
    }
});
 
console.log("user parse : "  + "piste 1");
// Click:logout ---> Retour nouvelle session de travail
document.getElementById("menuIndex").addEventListener("click", (event) => {

    event.preventDefault(); //car herf="#" au depart (20-05-26 supprimer !!!)

    window.localStorage.removeItem('works'); //Obliger à rechargement de la Database

    sessionStorage.removeItem("logging"); // Retour à Accueil

    window.location.href = "index.html";
});
console.log("user parse : "  + "piste 2");
// Retour Grille images Mini et Maxi : fa-arrow-left
document.querySelector(".popup-content2 .fa-arrow-left")
.addEventListener("click", async (event) => {
     
    document.querySelector(".popup-content2").classList.add("hidden");      
    document.querySelector(".popup-content1").classList.remove("hidden");  

});
console.log("user parse : "  + "piste 3"); 
// Fermeture de la Modale : popup-content1
let closePopup1 = document.querySelector(".popup-content1 .close-popup"); 
closePopup1.addEventListener("click", () => {    
    window.localStorage.removeItem('works');
    window.location.reload(); 
});
console.log("user parse : "  + "piste 4");
boiteModal.addEventListener("click", (event) => {  // La fermeture exterieure*/
    console.log("Detecte close : boiteModal");      // de boite modale se joue Ici !!!
    // clic à l'extérieur du popup
    if (event.target === boiteModal) {       
        console.log("Fermeture : boiteModal");
        //boiteModal.classList.add("hidden");
    }
}); 
console.log("user parse : "  + "piste 5");
// Fermeture de la Modale : popup-content2
let closePopup2 = document.querySelector(".popup-content2 .close-popup"); 
closePopup2.addEventListener("click", (event) => {
    //console.log("execution de la fonction modale: 6 ?");
    window.localStorage.removeItem('works');                                 // 20/01/25 Delete
    window.location.reload(); 
});
