const tokenName = 'bigscreen_survey';
let adminId, adminName, adminToken;

window.addEventListener('DOMContentLoaded', function() {
    if (window.localStorage.getItem(tokenName)) {
        [adminId, adminName, adminToken] = window.localStorage.getItem(tokenName).split('_');

    } else if (window.location.href.includes('dashboard.html')) {
        window.location.href = 'login.html';
    }
});







