window.Auth = {
    // Faz login usando Supabase Auth
    login: async function (email, password) {
        const { data, error } = await window.supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            console.error('Erro no login:', error.message);
            return error.message; // Retorna a mensagem real (ex: Invalid login credentials)
        }

        // Sessão é salva automaticamente no browser pelo SDK
        localStorage.setItem('portfolio_auth', 'true'); // Mantemos para compatibilidade rápida
        return true;
    },

    // Faz logout
    logout: async function () {
        await window.supabaseClient.auth.signOut();
        localStorage.removeItem('portfolio_auth');
        window.location.href = 'index.html';
    },

    // Verifica se o usuário está logado
    checkAuth: async function () {
        const { data: { session } } = await window.supabaseClient.auth.getSession();

        if (!session) {
            window.location.href = 'login.html';
        }
    }
};
