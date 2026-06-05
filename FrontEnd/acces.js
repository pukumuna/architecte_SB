//Récupération des works eventuellement stockées dans le localStorage
export async function chargerWorks() {
//async function chargerWorks() {

    let wlstWorks = localStorage.getItem("works");
    wlstWorks = "";
    if ((! wlstWorks) || (wlstWorks === null)) {

        //const response = await fetch("http://localhost:5678/api/works");
        //const jsWorks = await response.json();
        const jsWorks = await fetch("http://localhost:5678/api/works")
                       .then(resp => resp.json());
        let wlstWorks = JSON.stringify(jsWorks);
        localStorage.setItem("works", wlstWorks);
        
        return wlstWorks;
    }
}

//Récupération des categories eventuellement stockées dans le localStorage
export async function chargerCategories() {
//async function chargerCategories() {

    let wlstCategories = localStorage.getItem("categories");
    wlstCategories = "";
    if ((! wlstCategories) || (wlstCategories === null))  {

        //const response = await fetch("http://localhost:5678/api/categories");
        //const jsCategories = await response.json();
        const jsCategories = await fetch("http://localhost:5678/api/categories")
                            .then(resp => resp.json());
        let wlstCategories = JSON.stringify(jsCategories)
        localStorage.setItem("categories", wlstCategories);
        console.log("Test works local store :  + chargeCategories");
    }
}
