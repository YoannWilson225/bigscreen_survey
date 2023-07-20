// Gérer le mode du dashboard
const sideMenu = document.querySelector('aside');
const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-btn');

const darkMode = document.querySelector('.dark-mode');

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
        type: 'radar', // Type de graphique radar
        data: {},
        options: chartOptions
    });
}

// Fonction pour récupérer les données des questions 6 à 7 depuis l'API
function fetchData() {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://127.0.0.1:8000/api/stats', true);
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
    xhr.open('POST', 'http://127.0.0.1:8000/api/qualitystats', true);
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


// Appeler la fonction pour initialiser les graphiques
initCharts();

// Fonction pour mettre à jour les graphiques avecles données récupérées
function updateChartData(data) {
    chart1.data = generateChartData(data, 6);
    chart2.data = generateChartData(data, 7);
    chart3.data = generateChartData(data, 10);
    chart4.data = generateChartData(data);

    chart1.update();
    chart2.update();
    chart3.update();
  }



  // Fonction pour mettre à jour les données spécifiques aux questions 11 à 15 et le quatrième graphique de type radar
function updateQualityChartData(data) {
    // Récupérer les données spécifiques aux questions 11 à 15
    var questionData = data.find(function(item) {
        return item.question_id >= 11 && item.question_id <= 15;
    });

    if (questionData && questionData.responses) {
        var labels = Object.keys(questionData.responses);
        var values = Object.values(questionData.responses);

        // Mettre à jour le quatrième graphique de type radar
        chart4.data = {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        };

        chart4.update();
    }
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


// Fonction pour récupérer les questions depuis l'API
function fetchQuestions() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://127.0.0.1:8000/api/questions', true);
    xhr.onload = function() {
            if (xhr.status !== 200) {
                console.error(`Erreur ${xhr.status} : ${xhr.statusText}`);
                return;
            }

            const response = JSON.parse(xhr.responseText);
            const questions = response.questions;
            const questionsContainer = document.getElementById('questions');

            // Parcourir les questions et les ajouter au tableau
            questions.forEach((question, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${question.body}</td>
                    <td>${question.type}</td>
                `;
                questionsContainer.appendChild(row);
            });
        };
    xhr.onerror = function () {
        console.error('Une erreur s\'est produite lors de la requête XHR pour récupérer les questions.');
    };
    xhr.send();
}

// Fonction pour récupérer les réponses depuis l'API
function fetchResponses() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://127.0.0.1:8000/api/admin/answers/get', true);
    xhr.onload = function() {
            if (xhr.status !== 200) {
                console.error(`Erreur ${xhr.status} : ${xhr.statusText}`);
                return;
            }

            const resp = JSON.parse(xhr.responseText);
            const responses = resp.responses;
            const reponsesContainer = document.getElementById('reponses');

            // Parcourir les questions et les ajouter au tableau
            responses.forEach((response, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${response.body}</td>
                    <td>${response.response}</td>
                `;
                reponsesContainer.appendChild(row);
            });
        };
    xhr.onerror = function () {
        console.error('Une erreur s\'est produite lors de la requête XHR pour récupérer les questions.');
    };
    xhr.send();
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
    fetchData();
    fetchQualityData();
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




