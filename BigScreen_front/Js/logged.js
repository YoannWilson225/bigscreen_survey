window.addEventListener('DOMContentLoaded', function() {
    // Si le token est présent, envoyez une requête au backend pour vérifier s'il est valide
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `http://127.0.0.1:8000/api/admin/logged/${adminToken}`, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                console.log(response.token);
                if (response.token) {
                    if (window.location.href.includes('login.html')) {
                        window.location.href = 'dashboard.html';
                    }
                }
                else {
                    window.localStorage.removeItem(tokenName);

                    if (!window.location.href.includes('login.html')) {
                        window.location.href = 'login.html';
                    }
                }
            } else {
                console.error('Une erreur s\'est produite lors de la requête XHR:', xhr.status);
            }
        }
    };
    xhr.send();
    });
