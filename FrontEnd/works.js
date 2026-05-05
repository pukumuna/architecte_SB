//constante Grille Gallerie
const galery = document.querySelector(".maxGallery");    // 27-02-26

window.localStorage.removeItem('works');  // 20/01/25 à supprimer
//Récupération des works eventuellement stockées dans le localStorage
let wlstWorks = window.localStorage.getItem('works'); //works = "";

if (wlstWorks === null) {
    // Récupération des works depuis l'API
    //nst reponse = await fetch("http://localhost:5678/api/works").then(works => works.json()); // Fusionner
    //const reponse = await fetch('works-data.json');
    const reponse = await fetch("http://localhost:5678/api/works");
    let jsWorks   = await reponse.json(); //works au format JS
    console.log("works oyé oyé : " + jsWorks[0].title);
    // Transformation des works en JSON (sérialiser)
    const wlstWorks = JSON.stringify(jsWorks);
    // Stockage des informations dans le localStorage (sorte de sauvegarde light)
    window.localStorage.setItem("works", wlstWorks);
}    

const works = JSON.parse(window.localStorage.getItem('works'));
console.log("Test works local store : " + works[0].title);


afficherTravaux(works);

//Affichage dynamique de la liste de catégorie
//Pour permettre le Filtrage par type(catégotie) de travaux
let categories = window.localStorage.getItem('categories');
if (categories === null) {
    const categories = await fetch("http://localhost:5678/api/categories").then(categories => categories.json());
    
    // Transformation des categories en JSON (sérialiser)
    const valeurCategories = JSON.stringify(categories);
    // Stockage des informations dans le localStorage (sorte de sauvegarde light)
    window.localStorage.setItem("categories", valeurCategories);
} else {
    categories = JSON.parse(categories);
}
const categFiltre = document.querySelector(".categFiltre");
//D'abord Catégories "Tous"
const categDiv  = document.createElement("div");
const categLien = document.createElement("a");
categLien.href="#"; //Ces 5 lignes attributs du lien <a...>
//categLien.id = 0;  //Modifier à cause du focus
//categLien.dataset.id =  0; //Modifier à cause du focus
categLien.id = "tous";
categLien.dataset.name = "Tous"; 
categLien.innerText = "Tous";
categLien.classList.add("categActive");
categLien.classList.add("categNormal");
categDiv.appendChild(categLien);
categFiltre.appendChild(categDiv);
//Ensuite autres Catégories "Objets", ...
for (let i=0; i < categories.length; i++) {
    const categorie = categories[i];
    const categDiv  = document.createElement("div");
    const categLien = document.createElement("a");

    //categLien.id = i+1;  //Modifier à cause du focus
    //categLien.dataset.id =  categorie.id; //Modifier à cause du focus
    categLien.href="#";
    categLien.id= categorie.name;
    categLien.innerText = categorie.name;
    categLien.dataset.name = categorie.name;   
    categLien.classList.add("categNormal");
    categDiv.appendChild(categLien);
    categFiltre.appendChild(categDiv);
}

//Affichage dynamique de la liste des Travaux de Architecte
function afficherTravaux(projets) {
       
    galery.innerHTML = ``;
     
    for (let i=0; i < projets.length; i++) {
        const projet = projets[i];
        const figure = document.createElement("figure");
        const image  = document.createElement("img");
        const caption = document.createElement("figcaption");
        image.src=projet.imageUrl;
        image.alt=projet.title; 
        caption.innerText=projet.title;
        
        figure.appendChild(image);
        
        figure.appendChild(caption);

        galery.appendChild(figure);

    }
}
// Event listener sur categorie clicquée | Ctrl en cas de Click / Catégorie
// Ctrl que l'id du lien correpond à la catégorie de l'élément
 
const liensCateg = document.querySelectorAll(".categFiltre a");
//Scan de tous les liens "liensCateg" pour savoir lequel a été cliqué
for (let i=0; i < liensCateg.length; i++) {
    let categLien = liensCateg[i];
    categLien.addEventListener ("click", (event) => {
        categLien.classList.add("categActive");
        // dataset.name = name de la catégorie    
        filtreObjects(event.target.dataset.name);
        let categorieName = event.target.dataset.name;
        for (let j=0; j < liensCateg.length; j++) {
            let categLien = liensCateg[j]; 
            categLien.classList.add("categNormal");            
            if (!(categLien.dataset.name === categorieName)) {
                categLien.classList.remove("categActive");        
            }
        };
        categLien.href = "#`${event.target.dataset.name}`";
    })
} 

// Filtre objets sur la categorie selectionnee
function filtreObjects(name) { // "name" = event.target.dataset.name
    if (name === "Tous") {
        afficherTravaux(works);
    } else {
      const worksFiltres =  
      works.filter(obj => obj.category.name === name);
      afficherTravaux(worksFiltres);
    }
  }

  // Initialisation à "tous" en cas de click sur nav Projets
  const aHeader = document.querySelector("header a[href='#Projets']");
  aHeader.addEventListener("click", (event) => {
    const initFiltre = document.querySelectorAll(".categFiltre a");
    initFiltre[0].classList.add("categNormal");
    initFiltre[0].classList.add("categActive");
    for (let i=1; i < initFiltre.length; i++) {
        initFiltre[i].classList.add("categNormal");
        initFiltre[i].classList.remove("categActive");
    }
  }) 

  
  

