//Variable Gallerie et icone
let works = "";
let idel = ""; // Contient index image miniature supprimée
const galery = document.querySelector(".popup-grid1");      // 27-02-26
const maxGalery = document.querySelector(".maxGallery");    // 27-02-26
const uploadSection = document.querySelector('.upload-section'); // 27-02-26
let fileInput = document.getElementById("fileImg");
 
const modale = document.getElementById("boiteModal");

// Traitement de la saisie Ajout Photo des Projets 
const titleInput = document.getElementById("title");
const statous    = document.getElementById("statous");
//const fileInput  = document.getElementById("fileImg");
const chargList  = document.querySelector("#lstcateg");

const optSelect  = document.querySelector(".optSelect");
const submitBtn  = document.getElementById("submitBtn");
const errorMessage = document.getElementById("errorMessage");

// Chargement de works
let wlstWorks = window.localStorage.getItem('works');

if (wlstWorks === null) {
     
    let reponse = await fetch("http://localhost:5678/api/works")
                .then(works => works.json());
    
    // Transformation des works de JSON en String(sérialiser)
    wlstWorks = JSON.stringify(reponse);

    // Stockage des informations dans le localStorage (sorte de sauvegarde light)
    window.localStorage.setItem("works", wlstWorks);    
}

//Récupération des works eventuellement stockées dans le localStorage
if ((works = JSON.parse(wlstWorks)) === null) {
    arretTraitement();
} 

let wlstCategories = window.localStorage.getItem('categories');
if (wlstCategories === null) {
    let reponse = await fetch("http://localhost:5678/api/categories")
          .then(categories => categories.json());
    
    // Transformation des categories en JSON (sérialiser)
    wlstCategories = JSON.stringify(reponse);
    // Stockage des informations dans le localStorage (sorte de sauvegarde light)
    window.localStorage.setItem("categories", wlstCategories);
} 
 
const categories = JSON.parse(wlstCategories);

afficherTravaux();

function arretTraitement() {
    console.log("Visuel works : est null, arrêt traitement");
    return;
} 


//Affichage dynamique de la liste des Travaux de Architecte
function afficherTravaux() {
    
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
        figure.appendChild(image); 
        figure.appendChild(caption);

        maxGalery.appendChild(figure);
    }
}

    /* *********************************************************** --- */
    /* ************************* Modal *************************** --- */
    /* *********************************************************** --- */
    /* ----------------------------------------------------------------*/
    /* ----------------------  MEF UPload Photo    --------------------*/ 
    /* ----------------------------------------------------------------*/  

function initloadImg() {  //Init du bloc pour load img + Titre + catégorie

    console.log("Initialisation du cadre de loading photo !!!");

    uploadSection.innerHTML = "";
        
    const iconContainer = document.createElement('div');
    iconContainer.className = 'icon-container';
    iconContainer.innerHTML = '<i class="fa-solid fa-photo-film"></i>';

    const btnPhoto = document.createElement('div');
    btnPhoto.className = 'btn-photo';
    btnPhoto.innerHTML = `<input type="file" id="fileImg" accept="image/jpeg, image/png" hidden>
                          <label for="fileImg">+ Ajouter Photo</label>`;

    const uploadInfo = document.createElement('div');
    uploadInfo.className = 'upload-info';
    uploadInfo.textContent = 'jpg, png : 4Mo max';

    uploadSection.appendChild(iconContainer);
    uploadSection.appendChild(btnPhoto);
    uploadSection.appendChild(uploadInfo);

    let optSelect = document.querySelector(".optSelect"); // 07-03-26
    optSelect.setAttribute("id","");    // 07-03-26
    optSelect.setAttribute("name","");  // 07-03-26
    
    document.querySelector(".popup-content2 #title").value = "";
    document.querySelector(".popup-content2 #statous").value = "";
            //document.querySelector(".popup-content2 #fileImg").value = "";
    document.querySelector(".popup-content2 #lstcateg").value = "";
    document.querySelector(".popup-content2 #errorMessage").value = "";

    document.querySelector("#submitBtn").classList.remove("enabled");
    document.querySelector("#submitBtn").classList.add("remplir");

    fileInput = document.getElementById("fileImg");

    fileInput.addEventListener("change", handleFileChange); 

}

function chargtCategories() {                 // 19/03/26  

    console.log("Prechargement categories"); 
        
    //const chargList = document.querySelector("#lstcateg");
    //chargList.innerHTML = "";  // 19-03-26
     
    
    for (let i=0; i < categories.length; i++) {
        let optionCat = document.createElement("option");
        //optionCat.value = categories[i].name;
        optionCat.innerText = categories[i].name;
        chargList.appendChild(optionCat);
        console.log("execution de la fonction modale:2 /" +i); 
    } 
 }

function chargtPopupGrid1() {

    galery.innerHTML = "";  // 05-03-26
    
 
    console.log("chargement des images stockées dans table interne"); 
  
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
        console.log("rang de image chargée :" + i + " et " + projet.id);
            
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
            const token = JSON.parse(userData).token;
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
                statous.textContent = "Erreur : " + error.message;
                statous.style.color = "red";
                console.log("Reponse du delete-Other");
            }
             
            // Suppression de élément du tableau works
            console.log("Avant slice longueur works : " + works.length);
            let workTab = works.filter(work => work.id != id);

            console.log("Après slice longueur works : " + workTab.length);
            works = workTab;
            afficherTravaux(); 
        }); //fin de icone "click" 
            
        modale.style.visibility = "visible";   
        modale.scrollTop = modale.scrollHeight;  // 21-03-26
        modale.focus();  // 21-03-26
        //let ajoutjPhoto = document.getElementsByClassName("ajoutPhoto");    // 21-03-26
        //ajoutjPhoto.scrollIntoView({ behavior: 'smooth', block: 'end' }); // 21-03-26 
        //ajoutjPhoto.focus();  // 21-03-26              
    } 
    
} 


// Définition de la fonction controleData ------------------*
function controleData() {
    const categorie = [];
    const file  = fileInput.files[0] ;
    
    const title = titleInput.value.trim();
    const optSelect  = document.querySelector(".optSelect");
    // Vérification du fichier
    
    let isValid = true;
    let messErreur = [];
    statous.textContent = '';
    errorMessage.textContent = '';

     // Vérification de fichier
    if (!file) {
        isValid = false;
        messErreur.push('Veuillez sélectionner un fichier.');
    }
    else {
        console.log("file-de-controleData : " 
         + file.name + " - " + file.type + " - " + file.size);
        console.log("optSelect--getAttribute: "  + optSelect.getAttribute("id")); 
    }

    // Vérification du titre
    if (isValid && !title) {
        isValid = false;
        messErreur.push('Le titre ne peut pas être vide.');
    }

   // Vérification de categorie 
   if (isValid && !optSelect.getAttribute("name"))  {
        isValid = false;
        messErreur.push("La categorie ne peut pas être vide.");
    }   else {
        categorie.name = optSelect.getAttribute("name");
    } 

    
    // Mise à jour du message d'erreur
    if (!isValid) {
        errorMessage.classList.add("rouge");
        errorMessage.classList.remove("vert");
        errorMessage.textContent = messErreur.join(); 
        submitBtn.classList.remove("enabled");
        submitBtn.classList.add("remplir");
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
titleInput.addEventListener("input", () => {    // 09-02-26
    controleData();
});  


// Selection de l'image photo sur la présentation des images à l'écran
function handleFileChange(event) {  
      
    const file = event.target.files[0]; 
    console.log("fichier - file = " + file.name + ' ' + file.type); 
    if (file && (file.size < 4 * 1024 * 1024) &&
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

        console.log("Image - Toto") ;     

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



    /* ------------------------------------------------------*/
    /* ----------------Fin MEF UPload Photo -----------------*/ 
    /* ------------------------------------------------------*/     

afficherTravaux();

//initloadImg();              !!!!! Mise en stand by 08-03-26 ??????   
    
/* ------------------------------------------ --------------------------------------*/
/* ------------------------------- Procécures Evenementielles ----------------------*/
/* ------------------------------------------ --------------------------------------*/

//////////// Execution de la 1ere modale : Mini Grille des Photos ///////////
let edition = document.getElementById("fenetre");  
edition.addEventListener("click", (event) => { //Fenetre Affiche Modale
        console.log("execution de la fonction modale:1"); 
    
        document.querySelector("#boiteModal").classList.remove("hidden");                                    
        document.body.style.backgroundColor = "rgba(178, 189, 189, 0.8)";

        document.querySelector(".popup-content2").classList.add("hidden");
        document.querySelector(".popup-content1").classList.remove("hidden");

        galery.setAttribute("display","flex");
    
        //document.querySelector(".optSelect").setAttribute("id",""); //20-01-25
        document.querySelector(".optSelect").setAttribute("id",""); // 20-01-25
        document.querySelector(".optSelect").setAttribute("name",""); // 20-01-25

        chargtCategories();                                // 19/03/26
        
        chargtPopupGrid1();                                // 23-02-26   
    
});  // Fin d'exécution de la 1er modale

// <----     Passage de la 1er Modale au 2eme Modale par appui sur la touche : Ajout Photo  -> //
// ---------------------------------------------------------------------------------------------- 
document.querySelector(".popup-content1 .ajoutPhoto").addEventListener("click", (event) => {
    console.log("/Split Modale Grille-1 à Ajout Photo " );
    document.querySelector(".popup-content1").classList.add("hidden");
    document.querySelector(".popup-content2").classList.remove("hidden");

    console.log("Abordage de l'étape de chargement de(s) photo(s)");
    initloadImg();
    statous.textContent = '';
    errorMessage.textContent = '';
    document.querySelector(".popup-content2 #title").value = "";        // 12-02-26
    document.querySelector(".popup-content2 #statous").value = "";
    //document.querySelector(".popup-content2 #fileImg").value = "";
    document.querySelector(".popup-content2 #lstcateg").value = "";
    document.querySelector(".popup-content2 #errorMessage").value = ""; // 12-02-26 
    
    document.querySelector("#submitBtn").classList.remove("enabled");
    document.querySelector("#submitBtn").classList.add("remplir");
  
});

 
// Remplissage champs du formulaire : Détection de la selection sur Catégorie
chargList.addEventListener("click", (e) => {
    console.log("Event-categorie : " + e.target.value );
    const categorie = [];
    const chargCat = document.querySelector("#lstcateg");
    const optSelect = document.querySelector(".optSelect");
    
    for (let i=0; i < categories.length; i++) {
        if (chargCat.value === categories[i].name) {
            categorie.id   = categories[i].id;
            categorie.name = categories[i].name;
            optSelect.setAttribute("id", `${categories[i].id}`)
            optSelect.setAttribute("name", `${categories[i].name}`)
        }
    } 
    controleData();
 }); 
  
// Soumission des champs du formulaire et Record nouveau "work" 
let formulaire = document.getElementById("uploadForm");
formulaire.addEventListener("submit", async function (event) {

    event.preventDefault();
    console.log("Nettoyer la zone status par textContent !!!");
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
    /*
    console.log("namefile:" + fileInput.files[0].name);
    console.log("titlefile:" + titleInput.value.trim());
    console.log("categorie-id mama:" + optSelect.getAttribute("id"));
    console.log("categorie-nm mama:" + optSelect.getAttribute("name"));
    */
    let userEnr = window.localStorage.getItem('user');
    let userParse = JSON.parse(userEnr);
    let useridIsrt = userParse.userId;
    let tokenIsrt  = userParse.token;
    let imageUrlIsrt =   fileInput.files[0].name;
    let categoryIdIsrt = optSelect.getAttribute("id");
    let categoryNameIsrt = optSelect.getAttribute("name");
    /*
    console.log("user parse : "  + userParse);
    console.log("token Isrt : "  + tokenIsrt);
    console.log("userid Isrt : " + useridIsrt);
    console.log("title Isrt : " + titleInput.value.trim()); 
    console.log("imageUrl Isrt : " + imageUrlIsrt);       
    console.log("categoryId Isrt : " + categoryIdIsrt);
    console.log("categoryName Isrt : " + categoryNameIsrt);
    let objCategory = {"id":categoryIdIsrt, "name": categoryNameIsrt};
    */                                // Retabli au 21-01-26
    const fdWork = new FormData();
    //fdWork.append("id", 0);
    fdWork.append("title", titleInput.value.trim());
    //Work.append("imageUrl", fileInput.files[0].name); // 21-01-26
    fdWork.append("image", fileInput.files[0]);
    fdWork.append("category", categoryIdIsrt);
    //fdWork.append("userId", useridIsrt);   // 21-01-26
    //fdWork.append("category", objCategory); // 21-01-26
    
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
        fileInput.value = "";                     // 1-02-026
      } else {
        statous.textContent = "Erreur lors de l'enregistrement.";
        statous.style.color = "red";
        console.log("Erreur d'insertion :" +response.status);
      }
    } catch (error) {
      statous.textContent = "Erreur : " + error.message;
      statous.style.color = "red";
    }
    
});
 
 
// Retour Grille images Mini et Maxi : fa-arrow-left
document.querySelector(".popup-content2 .fa-arrow-left")
.addEventListener("click", async (event) => {
     
    document.querySelector(".popup-content2").classList.add("hidden");      // 23-02-26
    document.querySelector(".popup-content1").classList.remove("hidden");   // 23-02-26

    // Rechargement des nouveaux works et Rafraichissements de Window-Local-Storage       
    works = await fetch("http://localhost:5678/api/works")   // 06-03-26
                 .then(works => works.json());
    console.log("longueur works apres : " + works.length);        
    
    // Transformation des works de JSON en String(sérialiser)
    wlstWorks = JSON.stringify(works);

    // Stockage des informations dans le localStorage (sorte de sauvegarde light)
    window.localStorage.removeItem('works');                 // 27-02-26
    window.localStorage.setItem("works", wlstWorks);   

    afficherTravaux();        // Rechargement maxi Grille

      
    chargtPopupGrid1();       // Rechargement mini Grille                        
     
});
 
// Fermeture de la Modale : popup-content1
let closePopup1 = document.querySelector(".popup-content1 .close-popup"); 
closePopup1.addEventListener("click", (event) => {    
    // redirige vers la page indexModal.html
    window.localStorage.removeItem('works');                                 // 20/01/25 Delete
    window.location.reload();
});

// Fermeture de la Modale : popup-content2
console.log("execution de la fonction modale: 6 ?");
let closePopup2 = document.querySelector(".popup-content2 .close-popup"); 
closePopup2.addEventListener("click", (event) => {
    // redirige vers la page indexModal.html
    window.localStorage.removeItem('works');                                 // 20/01/25 Delete
    window.location.reload();
});
