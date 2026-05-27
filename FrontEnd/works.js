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

async function misefTravaux() {

   await chargerWorks();
    
   works = JSON.parse(localStorage.getItem("works"));
   //console.log("Test works local store : " + works[0].title);
   afficherTravaux(works); 
}

misefTravaux();

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

//-------------------------------------------------------------------------------------------------//
//----- Affichage dynamique catégorie Pour permettre Filtrage par (catégotie) de travaux  ---------//
//------------------------- si utilisateur non connecté comme Admmistrateur   ---------------------//
//-------------------------------------------------------------------------------------------------//

//nsole.log("appelle chargerCategories de la BD");
chargerCategories();

let categories = JSON.parse(localStorage.getItem('categories'));
//console.log("Test categories name : " +categories[0].name);

let categFiltre = document.querySelector(".categFiltre"); /* Stockage de toutes les categories à afficher ss forme de "div" */ 
//D'abord Catégories "Tous"                                  /* Sous forme des liens "a" chacun dans une "div" */ 
let categDiv  = document.createElement("div");
let categLien = document.createElement("a");
categLien.href="#"; //Ces 5 lignes attributs du lien <a...>
categLien.id = "tous";
categLien.dataset.name = "Tous"; 
categLien.innerText = "Tous";
categLien.classList.add("categActive");
categLien.classList.add("categNormal");
categDiv.appendChild(categLien);
categFiltre.appendChild(categDiv);
//Ensuite autres Catégories "Objets", ...
for (let i=0; i < categories.length; i++) {
    let categorie = categories[i];
    let categDiv  = document.createElement("div");
    let categLien = document.createElement("a");
    categLien.href = "#";
    categLien.id = categorie.name;
    categLien.innerText = categorie.name;
    categLien.dataset.name = categorie.name;   
    categLien.classList.add("categNormal");
    categDiv.appendChild(categLien);
    categFiltre.appendChild(categDiv);
}

// Event listener sur categorie clicquée | Ctrl en cas de Click / Catégorie
// Ctrl que l'id du lien correpond à la catégorie de l'élément
 
const liensCateg = document.querySelectorAll(".categFiltre a"); // Selection des liens de la section
//Scan de tous les liens "liensCateg" pour les mettre à l'écoute et savoir lequel a été cliqué
for (let i=0; i < liensCateg.length; i++) {
    let categLien = liensCateg[i];
    categLien.addEventListener ("click", (event) => {
        categLien.classList.add("categActive"); // lien cliqué a la "categActive"
        // Appel fonction "filtreObjects" avec [dataset.name = name de la catégorie]    
        filtreObjects(event.target.dataset.name);
        let categorieName = event.target.dataset.name;
        for (let j=0; j < liensCateg.length; j++) { // remove "categActive" aux autres liens
            let lienCateg = liensCateg[j];            
            if (!(lienCateg.dataset.name === categorieName)) {
                lienCateg.classList.remove("categActive");        
            }
        };
        categLien.href = "#`${event.target.dataset.name}`";
    })
} 

// Filtre objets - works - sur la categorie selectionnee
function filtreObjects(name) { // "name" = event.target.dataset.name
    if (name === "Tous") {
        afficherTravaux(works);
    } else {
      const worksFiltres =  
      works.filter(obj => obj.category.name === name);
      afficherTravaux(worksFiltres);
      /*for (let k=0; k < worksFiltres.length; k++) {
        console.log(name + ":" + worksFiltres[k].title );
      } */
    }
  }
 

  // Initialisation du lien de categorie'Tous' comme "lien actif"
  // en cas de click sur nav Projets
  const aHeader = document.querySelector("header a[href='#Projets']");
  aHeader.addEventListener("click", (event) => {
    const initFiltre = document.querySelectorAll(".categFiltre a");
    initFiltre[0].classList.add("categActive");
    for (let i=1; i < initFiltre.length; i++) {
        initFiltre[i].classList.remove("categActive");
    }
  }) 
  