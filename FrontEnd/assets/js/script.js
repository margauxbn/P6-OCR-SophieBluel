//**************** TRAVAUX PAGE D'ACCUEIL ****************//

// Récupération des variables
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
    // Création des éléments HTML dynamiquement :
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");

    // Données reliées aux éléments :
    img.src = work.imageUrl;
    figcaption.textContent = work.title;

    // Rangement des éléments HTML dynamiquement :
    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
}


async function showWorks() {
    const allWorks = await getWorks(); // Récupération des travaux dans une variable grâce à la fonction getWorks()
    // Pour chaque projet, affichage dans le DOM avec la fonction addWorks():
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

    const allCategories = await getCategories(); // Récupération des catégories dans une variable grâce à la fonction getCategories()

    // Création dynamique du bouton "Tous" :
    const buttonAll = document.createElement("button");
    buttonAll.textContent = "Tous";
    buttonAll.setAttribute("id", "0");
    buttonAll.classList.add("category-selected", "category-btn");
    filters.appendChild(buttonAll);

    // Pour chaque catégorie : 
    allCategories.forEach(category => {
        const button = document.createElement("button"); // Création dans le DOM

        button.textContent = category.name; // Nom lié à l'API
        button.id = category.id; // Id lié à l'API

        button.classList.add("category-btn"); // Ajout d'une classe pour le CSS

        filters.appendChild(button); // Ajout de chaque bouton créé dans la div .filters
    });

    filtersCategories(); // Appel de la fonction pour activer les filtres après avoir créé les boutons
}

showCategoryButtons();


//****** Activation des filtres ******//

// Filtrage au clic
async function filtersCategories() {
    const projects = await getWorks(); // Récupération des travaux
    const buttons = document.querySelectorAll(".filters button"); // Récupération des boutons

    buttons.forEach((button) => {
        button.addEventListener("click", (btn) => {
            const buttonId = btn.target.id; // Id du bouton cliqué ciblé
            gallery.innerHTML = ""; // Gallerie vidée au click

            buttons.forEach((btn) => btn.classList.remove("category-selected")); // Classe retiré au click sur tous les boutons
            btn.target.classList.add("category-selected"); // Classe ajouté sur le bouton cliqué


            if (buttonId !== "0") {
                const filteredWorks = projects.filter((work) => work.categoryId == buttonId);
                // Le tableau d'ojets project subit la méthode filter avec les paramètres donnés de la fonction ;
                // Pour chaque projet, on vérifie si son ID correspond au même ID que le bouton cliqué

                filteredWorks.forEach(work => {
                    addWorks(work); // Ajout de chaque travail filtré dans la gallerie
                });
            } else {
                projects.forEach(work => {
                    addWorks(work); // Même procédé mais avec buttonId == 0
                }); 
            }
        });
    });
};


//****** Utilisateur connecté ******//

const logout = document.querySelector("header nav ul a li"); // Récupération du bouton de connexion

if (sessionStorage.token) { // Si le token de connexion est présent dans le session storage
    logout.textContent = "logout"; // "Login" remplacé par "logout"

    logout.addEventListener("click", () =>
        sessionStorage.removeItem("token") // Si le bouton "logout" est cliqué, on enlève le token du session storage = déconnexion
    );
};

const editMode = document.getElementById("edition"); // Récupération du block "Mode édition"
const editProject = document.getElementById("edit-project") // Récupération du bouton "Modifier"

if (sessionStorage.token) {
    editMode.style.display = "flex";
    editProject.style.display = "flex";
}; // Si le token est dans le session storage, les deux éléments passent de none à flex


//**************** MODALE ****************//

//****** Affichage de la modale ******//

const containerModal = document.getElementsByClassName("container-modal")[0];

editProject.addEventListener("click", () => {
    containerModal.style.display = "flex";
}); // Au click sur le bouton "modifier", la modale passe de none à flex


//****** Fermeture de la modale ******//

const xMark = document.getElementsByClassName("fa-x")[0];

xMark.addEventListener("click", () => {
    containerModal.style.display = "none";
}); // Au click sur xMark, la modale passe de flex à none


containerModal.addEventListener("click", (e) => {
    if (e.target.className === "container-modal") {
        containerModal.style.display = "none";
    }
}); // Si le clic cible précisément "container-modal", la modale passe de flex à none


//****** Affichage des projets dans la modale ******//

const projectModal = document.getElementsByClassName("project-modal")[0]; // Récupération de la div

async function addProjectModal() {
    projectModal.innerHTML = "" // Div vidée
    const projects = await getWorks(); // Récupération des travaux

    projects.forEach(project => {
        // Pour chaque projet, création des éléments dans le DOM :
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const span = document.createElement("span");
        const trash = document.createElement("i");

        // Données reliées aux éléments :
        img.src = project.imageUrl;
        trash.id = project.id; // Les poubelles sont liées à leur projet

        trash.classList.add("fa-solid", "fa-trash-can"); // Classe donnée aux icônes de suppression

        // Rangement des éléments dans le DOM :
        projectModal.appendChild(figure);
        figure.appendChild(img);
        figure.appendChild(span);
        span.appendChild(trash);
    });

    deleteProject(); // Fonction pour supprimer 
};

addProjectModal();


//****** Suppression des travaux dans la modale ******//

function deleteProject() {
    const allTrash = document.querySelectorAll(".fa-trash-can"); // Récupération des icônes de suppression

    allTrash.forEach(trash => {
        trash.addEventListener("click", (e) => {
            const trashId = trash.id; 

            const init = {
                method: "DELETE",
                headers: {
                    "content-Type" : "application/json", // Contenu de la requête en json
                    "Authorization": "Bearer " + sessionStorage.token // Action possible que si le token est dans le session storage
                },
            };

            fetch("http://localhost:5678/api/works/" + trashId, init) // Requête fetch avec l'identifiant ciblée et les options de init
            .then((response) => {
                if (!response.ok) {
                    console.log("delete not ok");
                }
                return response.json() // Convertit la réponse en json pour la traiter dans la prochaine étape
            })
            .then((data) => {
                console.log("delete ok", data)
                addProjectModal(); // Met à jour les travaux montrés dans la modale
                showWorks(); // Met à jour les travaux montrés dans la gallerie
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
    btnAddProject.addEventListener("click", () => { // Au clic sur le bouton "Ajouter une photo" :
        firstModal.style.display = "none", // La première modale passe de flex à none
        modalAddProject.style.display = "flex" // La modale d'ajout de projet passe de none à flex
    });

    arrowLeft.addEventListener("click", () => { // Au clic sur la flèche de retour :
        firstModal.style.display = "flex", // La première modale passe de none à flex
        modalAddProject.style.display = "none" // La modale d'ajout de projet passe de flex à none
    });

    xMarkAdd.addEventListener("click", () => { // Au clic sur la croix :
        containerModal.style.display = "none" // Les modales passe de flex à none
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
    inputFile.addEventListener("change", () => { // Quand l'inputFile change 
        const file = inputFile.files[0]; // Récupère le premier fichier sélectionné dans le champ de fichier

        if(file) { // Si un fichier a été sélectionné 
            const reader = new FileReader(); // Permet de lire le contenu des fichiers de manière asynchrone

            reader.onload = function(e) { // Déclare une fonction qui se déclenche lorsque le fichier est entièrement lu
                imgPreview.src = e.target.result; // Définit la source de imgPreview sur le résultat de la lecture du fichier
                // Changement de style des éléments :
                imgPreview.style.display = "flex";
                imgIcon.style.display = "none";
                labelFile.style.display = "none";
                paragraphFile.style.display = "none";
                xMarkPreview.style.display = "flex";
            };
            reader.readAsDataURL(file); // Lit le contenu du fichier en tant qu'URL de données
        };
    });    
};

previewProject();


//****** Suppression de l'image sélectionnée dans la modale ******//

xMarkPreview.addEventListener("click", () => { // Au clic sur la croix :
    imgPreview.src = ""; // Vide de l'élément présent
    // Change le style des éléments :
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
    e.preventDefault(); // Empêche le comportement par défaut du navigateur

    const formData = new FormData(form); // Extrait toutes les valeurs des champs du formulaire (form)

    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            body: formData,
            headers: {
                "Authorization": "Bearer " + sessionStorage.token // Action possible que si le token est dans le session storage
            },
        });

        if (!response.ok) {
            throw new Error("Erreur lors de l'envoi des données : " + response.status);
        } // Si la réponse de la requête n'est pas ok, une erreur est lancée avec le statut de la réponse

        const data = await response.json(); // Récupère les données renvoyées par le serveur en format json

        addWorks(); // Met à jour les travaux dans la gallerie
        containerModal.style.display = "none"; // Ferme la modale

    } catch (error) {
        console.error('Erreur lors de la requête fetch :', error);
    } // Capture et affiche les erreur qui pourraient survenir lors de l'exécution de la requête fetch
});


//****** Conditions pour pouvoir poster le nouveau projet ******//

const btnValidation = document.getElementsByClassName("btn-validate-img")[0];

form.addEventListener("input", () => {
    if (title.value !== "" && category.value !== "" && inputFile.value !== "") { // Si le titre, la catégorie et l'input ne sont pas vides :
        btnValidation.classList.remove("btn-not-valid"); // Retrait de la classe btn-not-valid
        btnValidation.classList.add("btn-valid"); // Ajout de la clase btn-valid

        btnValidation.disabled = false; // Retrait de disabled
    }
});

