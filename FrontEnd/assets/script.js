const gallery = document.getElementsByClassName("gallery")[0];

// Fonction qui retourne les différents travaux
async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    return await response.json();
};
 
getWorks();

 
 //Affichage dans le DOM
async function showWorks() {
    const allWorks = await getWorks()

    allWorks.forEach(elementWorks => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const figcaption = document.createElement("figcaption");

        img.src = elementWorks.imageUrl;
        figcaption.textContent = elementWorks.title;

        gallery.appendChild(figure);
        figure.appendChild(img);
        figure.appendChild(figcaption);
    });
 }
 
 showWorks();
 
 