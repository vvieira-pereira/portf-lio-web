const DEFAULT_USER = "admin";
const DEFAULT_PASS = "123456";

window.Auth = {
    getCreds: function() {
        const creds = localStorage.getItem('portfolio_creds');
        if (creds) return JSON.parse(creds);
        
        const defaults = { user: DEFAULT_USER, pass: DEFAULT_PASS };
        localStorage.setItem('portfolio_creds', JSON.stringify(defaults));
        return defaults;
    },

    login: function(username, password) {
        const creds = this.getCreds();
        if (username === creds.user && password === creds.pass) {
            localStorage.setItem('portfolio_auth', 'true');
            return true;
        }
        return false;
    },

    logout: function() {
        localStorage.removeItem('portfolio_auth');
        window.location.href = 'index.html';
    },

    checkAuth: function() {
        if (!localStorage.getItem('portfolio_auth')) {
            window.location.href = 'login.html';
        }
    },

    changePassword: function(newPass) {
        const creds = this.getCreds();
        creds.pass = newPass;
        localStorage.setItem('portfolio_creds', JSON.stringify(creds));
        return true;
    }
};
