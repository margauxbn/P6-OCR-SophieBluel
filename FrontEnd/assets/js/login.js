const form = document.getElementById("login-form");

async function login() {
    form.addEventListener("submit", async (event) => {
        event.preventDefault(); 
        
        const email = form.querySelector("[name=email]").value;
        const password = form.querySelector("[name=password]").value;
        
        const formData = new FormData(form);
        const payload = new URLSearchParams(formData);
        
        function addErrorMessage(message) {
            document.querySelector(".error-message").textContent = message || "L'e-mail ou le mot de passe n'est pas correct";
        }

        try {
            const response = await fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                body: payload,
            });
            
            const data = await response.json();

            if (response.ok) {
                window.sessionStorage.setItem("token", data.token);
                window.location.href = "../index.html";
            } else {
                addErrorMessage(data.message);
            }
        } catch (error) {
            console.error('There was a problem with your fetch operation:', error);
            document.querySelector(".error-message").textContent = "Une erreur s'est produite lors de la tentative de connexion";
        }
    });
}

login();

