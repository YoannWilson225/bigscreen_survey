// Déclarer la variable questions dans le scope global
let questions;

// Créer une instance de XMLHttpRequest
const xhr = new XMLHttpRequest();

// Envoyer la requête GET vers l'API
xhr.open('GET', 'http://localhost:8000/api/questions', true);
xhr.send();

// Définir la fonction de rappel pour la réponse
xhr.onload = function () {
    if (xhr.status !== 200) {
        console.error(`Erreur ${xhr.status} : ${xhr.statusText}`);
        return;
    }

    let response;
    try {
        response = JSON.parse(xhr.responseText);
    } catch (error) {
        console.error('Erreur lors du parsing de la réponse JSON :', error);
        return;
    }

    questions = response.questions;

    if (!Array.isArray(questions)) {
        console.error("Les questions ne sont pas valides.");
        return;
    }

    const questionsContainer = document.getElementById('questionsContainer');

    if (questions.length === 0) {
        const noQuestionsMessage = document.createElement('p');
        noQuestionsMessage.textContent = "Aucune question n'est disponible.";
        questionsContainer.appendChild(noQuestionsMessage);
    } else {
        questions.forEach((question, index) => {
            const questionId = question.id;
            const questionIndex = index + 1; // Ajoutez 1 au compteur d'index

            // Créez une card Bootstrap pour chaque question
            const card = document.createElement('div');
            card.classList.add('col-md-12', 'mb-4', 'd-flex', 'flex-column'); // Ajoutez des classes pour définir la mise en page
            card.innerHTML = `
                <div class="card bg-dark">
                    <div class="card-header text-uppercase text-white font-weight-bold">
                        Question ${questionIndex}/20
                    </div>
                    <div class="card-body text-white">
                        <p>${question.body}</p>
                        ${renderQuestionInput(question, questionIndex)}
                    </div>
                </div>
            `;
            questionsContainer.appendChild(card);
        });
    }
};

// Récupérer le formulaire
const surveyForm = document.getElementById('surveyForm');

// Ajouter un écouteur d'événement sur la soumission du formulaire
surveyForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Empêcher le comportement par défaut du formulaire

    const emailInput = document.getElementById('question_1');

    // Récupérer l'élément du message d'e-mail invalide par son ID
    const invalidEmailMessage = document.getElementById('invalidEmailMessage');

      // Vérifier l'e-mail avant la soumission du formulaire
      if (!isValidEmail(emailInput.value)) {

        window.scrollTo(0, 0);
        emailInput.style.borderColor = 'red';
        // Faire descendre la div
        setTimeout(function () {
            invalidEmailMessage.style.top = '10px'; // Descendre du top de la page
        }, 10); // Délai court pour appliquer la transition

        // Masquer la div après l'animation
        setTimeout(function () {
            invalidEmailMessage.style.top = '10px'; // Remonter pour disparaître
            invalidEmailMessage.style.opacity = 0; // Masquer la div en réduisant l'opacité
        }, 4000); // 4 secondes pour l'affichage de l'alerte (à ajuster selon vos préférences)
          // Afficher le message
          invalidEmailMessage.style.opacity = 1; // Afficher le message en rétablissant l'opacité
          invalidEmailMessage.style.transform = 'translateX(-50%) translateY(5px)'; // Descendre légèrement du haut de la page

    // Masquer le message après un délai
    setTimeout(function () {
        invalidEmailMessage.style.transform = 'translateX(-50%) translateY(-200px)'; // Remonter pour disparaître
    }, 4000); // 4 secondes pour l'affichage de l'alerte (à ajuster selon vos préférences)

          // Empêcher la soumission du formulaire si l'e-mail n'est pas valide
          return;
      }else {
        emailInput.style.borderColor = 'green';
      }

    // Récupérer les réponses du formulaire
    const answers = [];

    for (let index = 0; index < questions.length; index++) {
        const question = questions[index];
        const questionId = question.id; // Utilisez l'ID de la question
        const questionIndex = index + 1;
        const input = document.getElementById(`question_${questionIndex}`);
        const answer = {
            question_id: questionId,
            value: input.value
        };
        answers.push(answer);
    }

    // Créer une instance de XMLHttpRequest
    const xhr = new XMLHttpRequest();

    // Envoyer la requête POST vers l'API pour enregistrer les réponses
    xhr.open('POST', 'http://localhost:8000/api/answers', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function () {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            const visitorId = response.visitor_id;
            // Réponses enregistrées avec succès, afficher la modal de remerciement avec l'URL unique
            const resultLink = generateUniqueUrl(visitorId);
            document.getElementById('resultLink').href = resultLink;
            document.getElementById('resultLinkInput').value = resultLink;
            $('#thankYouModal').modal('show');

            // Fonction pour copier le contenu de l'input dans le presse-papiers
           // Fonction pour copier le contenu de l'input dans le presse-papiers
function copyToClipboard(inputElement) {
    // Sélectionner l'élément input
    inputElement.select();
    inputElement.setSelectionRange(0, 99999); // Pour les appareils mobiles

    // Utiliser l'API Clipboard pour copier le contenu dans le presse-papiers
    navigator.clipboard.writeText(inputElement.value)
        .then(() => {
            // Afficher un message pour indiquer que le contenu a été copié avec succès
            console.log('Contenu copié :', inputElement.value);
            const copyLinkMessage = document.getElementById('copyLinkMessage');

            // Ajouter la classe 'show' pour déclencher l'animation
            copyLinkMessage.classList.add('show');

            // Faire descendre la div
            setTimeout(function () {
                copyLinkMessage.style.top = '10px'; // Descendre du top de la page
            }, 10); // Délai court pour appliquer la transition

            // Masquer la div après l'animation
            setTimeout(function () {
                copyLinkMessage.style.top = '10px'; // Remonter pour disparaître
                copyLinkMessage.style.opacity = 0; // Masquer la div en réduisant l'opacité
            }, 4000); // 4 secondes pour l'affichage de l'alerte (à ajuster selon vos préférences)

            window.scrollTo(0, 0);
        })
        .catch((error) => {
            // En cas d'erreur, afficher un message d'erreur
            console.error('Erreur lors de la copie dans le presse-papiers :', error);
        });
}

// Gestionnaire d'événement lorsque la modal est complètement fermée
$('#thankYouModal').on('hidden.bs.modal', function () {
    const resultLinkInput = document.getElementById('resultLinkInput');
    const copyLinkMessage = document.getElementById('copyLinkMessage');

    // Réinitialiser le formulaire en utilisant la méthode reset()
    document.getElementById('surveyForm').reset();
    emailInput.style.borderColor = 'black';

    // Effectuer la copie automatique lorsque la modal se ferme
    copyToClipboard(resultLinkInput);

    // Afficher le message
    copyLinkMessage.style.opacity = 1; // Afficher le message en rétablissant l'opacité
    copyLinkMessage.style.transform = 'translateX(-50%) translateY(5px)'; // Descendre légèrement du haut de la page

    // Masquer le message après un délai
    setTimeout(function () {
        copyLinkMessage.style.transform = 'translateX(-50%) translateY(-200px)'; // Remonter pour disparaître
    }, 4000); // 4 secondes pour l'affichage de l'alerte (à ajuster selon vos préférences)
});
        } else {
            // Erreur lors de l'enregistrement des réponses
            console.error('Erreur lors de l\'enregistrement des réponses');
        }
    };


    xhr.send(JSON.stringify({ answers }));
});

// Fonction pour vérifier le format de l'e-mail
function isValidEmail(email) {
    // Utilisez une expression régulière pour vérifier le format de l'e-mail
    const emailPattern = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/i);
    return emailPattern.test(email);
}

// Fonction pour générer le code HTML pour l'input en fonction du type de question
function renderQuestionInput(question, questionIndex) {
    if (question.type === 'A') {
        let optionsHTML = '';
        question.options.forEach((option) => {
            optionsHTML += `<option value="${option}">${option}</option>`;
        });
        return `
            <select class="form-control" id="question_${questionIndex}" name="question_${questionIndex}" required>
                <option value="">Sélectionnez une option</option>
                ${optionsHTML}
            </select>
        `;
    } else if (question.type === 'B') {
        return `
            <input type="text" class="form-control" id="question_${questionIndex}" name="question_${questionIndex}" maxlength="255" required>
        `;
    } else if (question.type === 'C') {
        return `
            <input type="number" class="form-control" id="question_${questionIndex}" name="question_${questionIndex}" min="1" max="5" required>
        `;
    } else {
        return ''; // Si le type de question est inconnu, retourner une chaîne vide
    }
}

// Fonction pour générer une URL unique
function generateUniqueUrl(visitorId) {
    // Utilisez le timestamp actuel comme base pour l'URL unique
    const timestamp = Date.now();
    // Concaténez le timestamp et l'identifiant unique du visiteur pour former l'URL unique
    const uniqueUrl = `http://localhost/bigscreen_survey/BigScreen_front/reponse?timestamp=${timestamp}&visitor_id=${visitorId}`;
    return uniqueUrl;
}
