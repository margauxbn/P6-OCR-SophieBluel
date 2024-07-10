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

const logout = document.querySelector("header nav ul a li");

if (sessionStorage.token) {
    logout.textContent = "logout";

    logout.addEventListener("click", () =>
        sessionStorage.removeItem("token")
    );
};

const editMode = document.getElementById("edition");
const editProject = document.getElementById("edit-project")

if (sessionStorage.token) {
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

            const init = {
                method: "DELETE",
                headers: {
                    "content-Type" : "application/json",
                    "Authorization": "Bearer " + sessionStorage.token
                },
            };

            fetch("http://localhost:5678/api/works/" + trashId, init)
            .then((response) => {
                if (!response.ok) {
                    console.log("delete not ok");
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


//****** Apparition de la modale d'ajout des nouveaux projets ******//

const firstModal = document.getElementsByClassName("elements-modal")[0];
const btnAddProject = document.getElementsByClassName("btn-add-img")[0];
const modalAddProject = document.getElementsByClassName("add-project-modal")[0];
const arrowLeft = document.getElementsByClassName("fa-arrow-left")[0];
const xMarkAdd = document.querySelector(".add-project-modal .fa-x");

function displayAddModal() {
    btnAddProject.addEventListener("click", () => {
        firstModal.style.display = "none",
        modalAddProject.style.display = "flex"
    });

    arrowLeft.addEventListener("click", () => {
        firstModal.style.display = "flex",
        modalAddProject.style.display = "none"
    });

    xMarkAdd.addEventListener("click", () => {
        containerModal.style.display = "none"
    });
};


displayAddModal();


//****** Aperçu de l'image dans la modale avant d'être postée ******//

const imgIcon = document.getElementsByClassName("fa-image")[0];
const labelFile = document.getElementsByClassName("label-file")[0];
const inputFile = document.getElementsByClassName("input-file")[0];
const imgPreview = document.getElementsByClassName("img-preview")[0];
const paragraphFile = document.getElementsByClassName("p-file")[0];
const xMarkPreview = document.getElementsByClassName("xmark-preview")[0];

function previewProject() {
    inputFile.addEventListener("change", () => {
        const file = inputFile.files[0];

        if(file) {
            const reader = new FileReader();

            reader.onload = function(e) {
                imgPreview.src = e.target.result;
                imgPreview.style.display = "flex";
                imgIcon.style.display = "none";
                labelFile.style.display = "none";
                paragraphFile.style.display = "none";
                xMarkPreview.style.display = "flex";
            };
            reader.readAsDataURL(file);
        };
    });    
};

previewProject();


//****** Suppression de l'image sélectionnée dans la modale ******//

xMarkPreview.addEventListener("click", () => {
    imgPreview.src = "";
    imgPreview.style.display = "none";
    imgIcon.style.display = "flex";
    labelFile.style.display = "flex";
    paragraphFile.style.display = "flex";
    xMarkPreview.style.display = "none";
});



//****** Création d'une liste des catégories pour l'input "Select" ******//

async function addCategoriesModal() {
    const select = document.querySelector("form select");
    const categoriesModal = await getCategories();

    categoriesModal.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;

        select.appendChild(option);
    });
};

addCategoriesModal();


//****** Ajout du projet souhaité ******//

const form = document.querySelector(".add-project-modal form");
const title = document.querySelector("form #title");
const category = document.querySelector("form #category");


form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            body: formData,
            headers: {
                "Authorization": "Bearer " + sessionStorage.token
            },
        });

        if (!response.ok) {
            throw new Error("Erreur lors de l'envoi des données : " + response.status);
        }

        const data = await response.json();

        addWorks();
        containerModal.style.display = "none";

    } catch (error) {
        console.error('Erreur lors de la requête fetch :', error);
    }
});


//****** Conditions pour pouvoir poster le nouveau projet ******//

const btnValidation = document.getElementsByClassName("btn-validate-img")[0];

form.addEventListener("input", () => {
    if (title.value !== "" && category.value !== "" && inputFile.value !== "") {
        btnValidation.classList.remove("btn-not-valid");
        btnValidation.classList.add("btn-valid");

        btnValidation.disabled = false;
    }
});

