import { chargerWorks, chargerCategories } from "./acces.js";
///
let menuLog = document.getElementById("menuIndex");
menuLog.innerHTML = `
        <a class="nave" href="login.html">login</a>
    `;
let modEntete = document.querySelector(".modEntete");
modEntete.innerHTML = ``; 
modEntete.style.backgroundColor = "#FFFEF8";
modEntete.style.borderColor = "#FFFEF8";

let filtre_edit = document.getElementById("filtre_edit");
filtre_edit.innerHTML = `
        <div id="categProjet">
			<h2 id="Projets">Mes Projets</h2>
			<div class="categFiltre "></div>
		</div>
    `; 
 
//constante Grille Gallerie
let galery = document.querySelector(".maxGallery"); 

let works = "";

//recherche et affichage tous travaux dans Grille
extractAfficheTravaux();

//-------------------------------------------------------------------------------------------------//
//----- Affichage dynamique catégorie Pour permettre Filtrage par (catégotie) de travaux  ---------//
//------------------------- si utilisateur non connecté comme Admmistrateur   ---------------------//
//-------------------------------------------------------------------------------------------------//

//Voir d'abord si categories existent ds WLST sinon extraire
//categories de la base, enregistrement dans WLST 
chargerCategories();

let categories = JSON.parse(localStorage.getItem('categories'));
//console.log("Test categories name : " +categories[0].name);

let categFiltre = document.querySelector(".categFiltre"); /* Stockage de toutes les categories */
//D'abord Catégories "Tous"                               /* Sous forme des liens "a"  */
 
let categLien = document.createElement("a");
//categLien.href="#"; //Ces 5 lignes attributs du lien <a...>
categLien.href = "#Tous";
categLien.id = "Tous";
categLien.dataset.name = "Tous"; 
categLien.innerText = "Tous";
categLien.classList.add("categActive"); //Affichage en vert
categLien.classList.add("categNormal"); // 

categFiltre.appendChild(categLien);

ajoutLister("Tous");

//Ensuite autres Catégories "Objets", ...
for (let i=0; i < categories.length; i++) {
    let categorie = categories[i];
    //let categDiv  = document.createElement("div");
    let categLien = document.createElement("a");
    categLien.href = "#";
    categLien.id = categorie.name;
    categLien.innerText = categorie.name;
    categLien.dataset.name = categorie.name;   
    categLien.classList.add("categNormal");

    categFiltre.appendChild(categLien);

    ajoutLister(categorie.name);
}

//Voir d'abord si travaux existent ds WLST sinon extraire
//travaux de la base, enregistrement dans WLST et afficher travaux 
async function extractAfficheTravaux() {

   await chargerWorks();
    
   works = JSON.parse(localStorage.getItem("works"));
   //console.log("Test works local store : " + works[0].title);
   afficherTravaux(works); 
}

//Ajout AddEventListener
function ajoutLister(id) {
    let categLien = document.getElementById(id)
    categLien.addEventListener ("click", (event) => {
        console.log("Categorie active " + event.target.dataset.name); 
        categLien.classList.add("categActive"); // lien cliqué a la "categActive"
        // Appel fonction "filtreObjects" avec [dataset.name = name de la catégorie]   
        filtreObjects(event.target.dataset.name);
        let categorieName = event.target.dataset.name;
        let liensCateg = document.querySelectorAll(".categFiltre a"); // Select tous liens de la section
        for (let j=0; j < liensCateg.length; j++) { // remove "categActive" aux autres liens
                     
            if ( !(liensCateg[j].dataset.name === categorieName) ) {
                liensCateg[j].classList.add("categNormal");
                liensCateg[j].classList.remove("categActive");        
            }
        };
        categLien.href = "#`${event.target.dataset.name}`";
    })
}

//Affichage dynamique de la liste des Travaux de Architecte
function afficherTravaux(projets) {
       
    galery.innerHTML = ``;
     
    for (let i=0; i < projets.length; i++) {
        const projet = projets[i];
        const figure = document.createElement("figure");
        const image  = document.createElement("img");
        const caption = document.createElement("figcaption");
        caption.classList.add("titrImage");
        image.src=projet.imageUrl;
        image.alt=projet.title; 
        caption.innerText=projet.title; 
        
        figure.appendChild(image);
        
        figure.appendChild(caption);

        galery.appendChild(figure);

    }
}

// Filtre objets - works - sur la categorie selectionnee
function filtreObjects(name) { // "name" = event.target.dataset.name
    if (name === "Tous") {
        extractAfficheTravaux();
    } else {
      const worksFiltres =  
      works.filter(obj => obj.category.name === name);
      afficherTravaux(worksFiltres);
    }
}
