document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorAlert = document.getElementById('errorAlert');
    const successAlert = document.getElementById('successAlert');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(loginForm);

        let adminName = document.getElementById('email').value;

        // Envoi de la requête XHR vers votre fonction de login
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://127.0.0.1:8000/api/admin/login', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    if (response.status === 'done') {
                        // Login réussi, affiche l'alerte de succès
                        showSuccessAlert(response.message);
                        window.localStorage.setItem(tokenName, `${response.adminId}_${adminName}_${response.token}`);
                    } else {
                        // Login échoué, afficher l'alerte d'erreur
                        const errorMessage = response.error || 'Une erreur s\'est produite lors de la connexion';
                        showErrorAlert(errorMessage);
                    }
                } else {
                    console.error('Une erreur s\'est produite lors de la requête XHR:', xhr.status);
                }
            }
        };
        xhr.send(new URLSearchParams(formData));
    });

    // Fonction pour afficher l'alerte d'erreur
    function showErrorAlert(message) {
        // Sélectionner l'élément errorAlert dans le DOM
        const errorAlert = document.getElementById('errorAlert');

        // Mettre à jour le contenu du message d'erreur
        errorAlert.textContent = message;

        // Ajouter la classe d'alerte Bootstrap pour afficher l'aspect visuel de l'erreur
        errorAlert.classList.add('alert', 'alert-danger');

        // Supprimer la classe d-none pour afficher l'alerte
        errorAlert.classList.remove('d-none');

        // Cacher l'alerte de succès en cas d'erreur
        const successAlert = document.getElementById('successAlert');
        successAlert.classList.add('d-none');
    }


    // Fonction pour afficher l'alerte de succès
function showSuccessAlert(message) {
    successAlert.textContent = message;
    successAlert.classList.remove('d-none');
    // Cacher l'alerte de succès après 3 secondes (3000 millisecondes)
    setTimeout(function() {
        successAlert.classList.add('d-none');
        // Rediriger vers le dashboard après le délai
        redirectToDashboard();
    }, 3000);
    // Cacher l'alerte d'erreur en cas de succès
    errorAlert.classList.add('d-none');
}


    // Fonction pour rediriger vers le dashboard après un délai
function redirectToDashboard() {
    // Remplacez "dashboard.html" par le chemin de votre page de dashboard réelle
    window.location.href = "dashboard.html";
}

});
