const gallery = document.getElementsByClassName("gallery")[0];
const filters = document.getElementsByClassName("filters")[0];

//****** Ajout des travaux ******//

// Récupération des travaux
async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    return await response.json();
};

// Affichage dans le DOM
function addWorks(work) {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");

    img.src = work.imageUrl;
    figcaption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
}

async function showWorks() {
    const allWorks = await getWorks();
    allWorks.forEach((work) => {
        addWorks(work);
    });
}

showWorks();

//****** Ajout des boutons de filtres par catégorie ******//

// Récupération des catégories
async function getCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    return await response.json();
}

// Affichage des boutons
async function showCategoryButtons() {
    const allCategories = await getCategories();

    const buttonAll = document.createElement("button");
    buttonAll.textContent = "Tous";
    buttonAll.setAttribute("id", "0");
    buttonAll.classList.add("category-selected", "category-btn");
    filters.appendChild(buttonAll);

    allCategories.forEach(category => {
        const button = document.createElement("button");

        button.textContent = category.name;
        button.id = category.id;

        button.classList.add("category-btn");

        filters.appendChild(button);
    });

    filtersCategories(); // Appel de la fonction pour activer les filtres après avoir créé les boutons
}

showCategoryButtons();

//****** Activation des filtres ******//

// Filtrage au clic
async function filtersCategories() {
    const projects = await getWorks();
    const buttons = document.querySelectorAll(".filters button");

    buttons.forEach((button) => {
        button.addEventListener("click", (btn) => {
            const buttonId = btn.target.id;
            gallery.innerHTML = "";

            buttons.forEach((btn) => btn.classList.remove("category-selected"));
            btn.target.classList.add("category-selected");

            if (buttonId !== "0") {
                const filteredWorks = projects.filter((work) => work.categoryId == buttonId);
                filteredWorks.forEach(work => {
                    addWorks(work);
                });
            } else {
                projects.forEach(work => {
                    addWorks(work);
                });
            }
        });
    });
};