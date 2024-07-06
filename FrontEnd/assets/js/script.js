//**************** TRAVAUX PAGE D'ACCUEIL ****************//



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



//**************** FILTRES ****************//


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




//****** Utilisateur connecté ******//


const logged = window.sessionStorage.logged;
const logout = document.querySelector("header nav ul a li");


if (logged === "true") {
    logout.textContent = "logout";


    logout.addEventListener("click", () =>
        window.sessionStorage.logged = false
    );
};


const editMode = document.getElementById("edition");
const editProject = document.getElementById("edit-project")


if (logged === "true") {
    editMode.style.display = "flex";
    editProject.style.display = "flex";
};




//**************** MODALE ****************//


//****** Affichage de la modale ******//


const containerModal = document.getElementsByClassName("container-modal")[0];


editProject.addEventListener("click", () => {
    containerModal.style.display = "flex";
});



//****** Fermeture de la modale ******//


const xMark = document.getElementsByClassName("fa-x")[0];


xMark.addEventListener("click", () => {
    containerModal.style.display = "none";
});


containerModal.addEventListener("click", (e) => {
    if (e.target.className === "container-modal") {
        containerModal.style.display = "none";
    }
});



//****** Affichage des projets dans la modale ******//

const projectModal = document.getElementsByClassName("project-modal")[0];

async function addProjectModal() {
    projectModal.innerHTML = ""
    const projects = await getWorks();


    projects.forEach(project => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const span = document.createElement("span");
        const trash = document.createElement("i");


        img.src = project.imageUrl;
        trash.id = project.id;

        trash.classList.add("fa-solid", "fa-trash-can");

        projectModal.appendChild(figure);
        figure.appendChild(img);
        figure.appendChild(span);
        span.appendChild(trash);
    });


    deleteProject();
};

addProjectModal();


//****** Suppression des travaux dans la modale ******//

function deleteProject() {
    const allTrash = document.querySelectorAll(".fa-trash-can");

    allTrash.forEach(trash => {
        trash.addEventListener("click", (e) => {
            const trashId = trash.id;
            const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcyMDI1MzU2MywiZXhwIjoxNzIwMzM5OTYzfQ.X2KfyeHYPCY9VEZIxwIaSjQhXK1WUpDmgeMhQGRGwOc";
            const init = {
                method: "DELETE",
                headers: {
                    "content-Type" : "application/json",
                    "Authorization": "Bearer " + token
                },
            };
            fetch("http://localhost:5678/api/works/" + trashId, init)
            .then((response) => {
                if (!response.ok) {
                    console.log("delete pas ok");
                }
                return response.json()
            })
            .then((data) => {
                console.log("delete ok", data)
                addProjectModal();
                showWorks();
            });
        });
    });        
};


deleteProject();
