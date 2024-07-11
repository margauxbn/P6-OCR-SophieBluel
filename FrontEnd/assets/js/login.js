const form = document.getElementById("login-form"); // Récupération du formulaire de connexion

async function login() {
    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Empêche le comportement par défaut du navigateur
        
        const email = form.querySelector("[name=email]").value;
        const password = form.querySelector("[name=password]").value;
        
        const formData = new FormData(form); // Extrait toutes les valeurs des champs du formulaire (form)
        const payload = new URLSearchParams(formData); // Convertit formData en un objet URLSearchParams (création d'une chaîne de requête URL) pour formater les données sous forme de chaîne de requête URL encodée
        
        function addErrorMessage(message) {
            document.querySelector(".error-message").textContent = message || "L'e-mail ou le mot de passe n'est pas correct";
        } 

        try {
            const response = await fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                body: payload,
            });
            
            const data = await response.json(); // Renvoie les données de fetch en .json

            if (response.ok) {
                window.sessionStorage.setItem("token", data.token); // Si tout est ok = récupération du token de connexion
                window.location.href = "../index.html"; // Si tout est ok = page redirigée vers la page d'accueil
            } else {
                addErrorMessage(data.message); // Sinon, renvoie le message de la fonction addErrorMessage()
            }
        } catch (error) {
            console.error('There was a problem with your fetch operation:', error);
            document.querySelector(".error-message").textContent = "Une erreur s'est produite lors de la tentative de connexion";
        } // Si le try ne marche pas, error contiendra l'objet de l'erreur + le message envoyé à l'utilisateur sur sa page de connexion
    });
}

login();

