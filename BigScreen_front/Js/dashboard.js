// Gérer le mode du dashboard
const sideMenu = document.querySelector('aside');
const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-btn');

menuBtn.addEventListener('click', () => {
    sideMenu.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    sideMenu.style.display = 'none';
});


// Déclarer les variables pour les graphiques
let chart1, chart2, chart3, chart4;

// Fonction pour initialiser les graphiques
function initCharts() {
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false
    };

    chart1 = new Chart(document.getElementById('chart1'), {
        type: 'pie',
        data: {},
        options: chartOptions
    });

    chart2 = new Chart(document.getElementById('chart2'), {
        type: 'pie',
        data: {},
        options: chartOptions
    });

    chart3 = new Chart(document.getElementById('chart3'), {
        type: 'pie',
        data: {},
        options: chartOptions
    });

    chart4 = new Chart(document.getElementById('chart4'), {
        type: 'radar',
        data: {
            labels: ["Qualité de l'image", "Confort d'utilisation", "Connexion au réseau", "Qualité des graphismes 3D", "Qualité audio"],
            datasets: [{
                data: [0, 0, 0, 0, 0],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scale: {
                ticks: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Fonction pour récupérer les données des questions 6 à 7 depuis l'API
function fetchData() {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', `http://127.0.0.1:8000/api/admin/stats/${token}`, true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      var data = JSON.parse(xhr.responseText);
      updateChartData(data);
    } else {
      console.error('Une erreur s\'est produite lors de la récupération des données.');
    }
  };
  xhr.onerror = function() {
    console.error('Une erreur s\'est produite lors de la requête XHR.');
  };
  xhr.send();
}

// Fonction pour récupérer les données des questions 11 à 15 depuis l'API
function fetchQualityData() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', `http://127.0.0.1:8000/api/admin/qualitystats/${token}`, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            updateQualityChartData(data);
        } else {
            console.error('Une erreur s\'est produite lors de la récupération des données.');
        }
    };
    xhr.onerror = function() {
        console.error('Une erreur s\'est produite lors de la requête XHR.');
    };
    xhr.send();
}

function updateQualityChartData(data) {
    // Récupérer les données spécifiques aux questions 11 à 15
    var questionData = data.filter(function(item) {
        return item.question_id >= 11 && item.question_id <= 15;
    });

    if (questionData.length > 0) {
        var values = questionData.map(function(item) {
            return Object.values(item.responses)[0]; // Supposant que chaque question a une seule réponse
        });

        // Mettre à jour le quatrième graphique de type radar
        chart4.data.datasets[0].data = values;
        chart4.update();
    }
}

function updateChartData(data) {
    // Réinitialiser les données des graphiques
    chart1.data = {};
    chart2.data = {};
    chart3.data = {};

    // Mise à jour des données du premier graphique
    chart1.data = generateChartData(data, 6);
    chart1.update();

    // Mise à jour des données du deuxième graphique
    chart2.data = generateChartData(data, 7);
    chart2.update();

    // Mise à jour des données du troisième graphique
    chart3.data = generateChartData(data, 10);
    chart3.update();
}


// Fonction pour générer les données des graphiques à partir des réponses
function generateChartData(data, questionId) {
    var questionData = data.find(function (item) {
      return item.question_id === questionId;
    });

    if (questionData && questionData.responses) {
      var labels = Object.keys(questionData.responses);
      var values = Object.values(questionData.responses);

      return {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF8A00', '#4BC0C0']
        }]
      };
    }

    return null;
  }



 // Déclarer une variable pour stocker les questions
let questionsData = [];

// Fonction pour récupérer les questions depuis l'API
function fetchQuestions() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `http://127.0.0.1:8000/api/questions`, true);
    xhr.onload = function() {
        if (xhr.status !== 200) {
            console.error(`Erreur ${xhr.status} : ${xhr.statusText}`);
            return;
        }

        const response = JSON.parse(xhr.responseText);
        questionsData = response.questions; // Stocker les questions dans la variable
        const questionsContainer = document.getElementById('questions');

        // Parcourir les questions et les ajouter au tableau
        questionsData.forEach((question, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${question.body}</td>
                <td>${question.type}</td>
            `;
            questionsContainer.appendChild(row);
        });

        // Maintenant que les questions sont récupérées, appeler la fonction pour récupérer les réponses
        fetchResponses();
    };
    xhr.onerror = function () {
        console.error('Une erreur s\'est produite lors de la requête XHR pour récupérer les questions.');
    };
    xhr.send();
}

// Fonction pour récupérer les réponses depuis l'API
function fetchResponses() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `http://127.0.0.1:8000/api/admin/answers/get/${token}`, true);
    xhr.onload = function() {
        if (xhr.status !== 200) {
            console.error(`Erreur ${xhr.status} : ${xhr.statusText}`);
            return;
        }

        const resp = JSON.parse(xhr.responseText);
        const responses = resp.responses;
        const groupedResponses = groupResponsesByVisitorId(responses);

        // Appeler la fonction pour afficher les réponses dans différents tableaux
        displayResponses(groupedResponses);
    };
    xhr.onerror = function () {
        console.error('Une erreur s\'est produite lors de la requête XHR pour récupérer les questions.');
    };
    xhr.send();
}


// Fonction pour récupérer la question par son ID
function getQuestionById(questionId) {
    return questionsData.find(question => question.id === questionId);
}


function groupResponsesByVisitorId(responses) {
    const groupedResponses = {};

    responses.forEach((response) => {
        const visitorId = response.visitor_id;

        if (!groupedResponses[visitorId]) {
            groupedResponses[visitorId] = [];
        }

        groupedResponses[visitorId].push(response);
    });

    return groupedResponses;
}

function displayResponses(groupedResponses) {
    const reponsesContainer = document.getElementById('reponses');

    // Vider le contenu de la section des réponses
    reponsesContainer.innerHTML = '';

    // Parcourir les groupes de réponses par visitor_id
    for (const visitorId in groupedResponses) {
        if (groupedResponses.hasOwnProperty(visitorId)) {
            const responses = groupedResponses[visitorId];
            const tableCard = createResponseTable(visitorId, responses);
            reponsesContainer.appendChild(tableCard);

            // Ajouter un espace entre les cartes
            reponsesContainer.appendChild(document.createElement('br'));
        }
    }
}

// Fonction pour créer un tableau avec les réponses pour un visitor_id donné
function createResponseTable(visitorId, responses) {
    const card = document.createElement('div');
    card.className = 'card mb-4 bg-dark text-white';

    // Créer la carte-header pour afficher le visitor_id
    const cardHeader = document.createElement('div');
    cardHeader.className = 'card-header';
    cardHeader.textContent = `Visitor ID: ${visitorId}`;
    card.appendChild(cardHeader);

    // Créer le contenu du tableau (les en-têtes et les réponses)
    const table = document.createElement('table');
    table.className = 'table text-white';

    let tableContent = `<thead>
                        <tr>
                            <th>#</th>
                            <th>Question</th>
                            <th>Réponses</th>
                        </tr>
                        </thead>
                        <tbody>`;

    responses.forEach((response, index) => {
        // Récupérer la question correspondante par son ID
        const question = getQuestionById(response.question_id);

        // Ajouter les réponses à chaque question dans le tableau
        tableContent += `<tr>
                            <td>${index + 1}</td>
                            <td>${question.body}</td>
                            <td>${response.response}</td>
                        </tr>`;
    });

    tableContent += '</tbody>';
    table.innerHTML = tableContent;

    // Ajouter le tableau à la carte Bootstrap
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    cardBody.appendChild(table);
    card.appendChild(cardBody);

    return card;
}



// Fonction pour afficher la section correspondante lorsque vous sélectionnez un onglet
function showSection(sectionId) {
  var sections = document.getElementsByClassName('dashboard-section');
  for (var i = 0; i < sections.length; i++) {
    if (sections[i].id === sectionId) {
      sections[i].style.display = 'block';
    } else {
      sections[i].style.display = 'none';
    }
  }
}

// Fonction pour mettre à jour les données en fonction de l'onglet sélectionné
function updateContent(target) {
  if (target === 'accueil-section') {
    // Mettre à jour les graphiques
    fetchQualityData();
    fetchData();

  } else if (target === 'questionnaire-section') {
    // Récupérer et afficher les questions
    fetchQuestions();
  }else if (target === 'reponses-section') {
    // Récupérer et afficher les réponses
    fetchResponses();
  }
}

// Gestionnaire d'événements pour les liens de la barre de navigation
document.addEventListener('DOMContentLoaded', function () {
    // Appeler initCharts() une seule fois au chargement de la page
    initCharts();

    showSection('accueil-section');
    updateContent('accueil-section');
    var navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(function (link) {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            var target = this.getAttribute('data-target');
            showSection(target);
            updateContent(target);

            // Mettre à jour la classe active des liens de navigation
            navLinks.forEach(function (navLink) {
                navLink.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
});








