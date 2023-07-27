document.addEventListener('DOMContentLoaded', function() {

    const logoutLink = document.getElementById('logout');

    logoutLink.addEventListener('click', function(event) {
        event.preventDefault();

        // Envoi de la requête XHR vers votre fonction de logout
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `http://127.0.0.1:8000/api/admin/logout/${adminId}/${token}`, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    if (response.status === 'done') {
                        window.localStorage.removeItem(tokenName);
                        window.location.href = 'login.html';
                    } else {
                        alert('déconnexion impossible');
                    }
                } else {
                    console.error('Une erreur s\'est produite lors de la requête XHR:', xhr.status);
                }
            }
        };
        xhr.send();
    });
});
