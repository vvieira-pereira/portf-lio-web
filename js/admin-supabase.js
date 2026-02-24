// Funções de Administração com Supabase

const bucketName = 'portfolio';

/**
 * Faz upload de um arquivo para o Storage do Supabase e retorna a URL pública
 */
async function uploadFile(file, path) {
    if (!file) return null;

    // Nome único para o arquivo
    const fileExt = file.name.split('.').pop();
    const fileName = `${path}_${Date.now()}.${fileExt}`;
    const filePath = fileName; // Simplifica o caminho para evitar erro de pasta inexistente

    const { data, error } = await window.supabaseClient.storage
        .from(bucketName)
        .upload(filePath, file);

    if (error) {
        console.error('Erro no upload:', error);
        throw error;
    }

    // Pega a URL pública
    const { data: { publicUrl } } = window.supabaseClient.storage
        .from(bucketName)
        .getPublicUrl(filePath);

    return publicUrl;
}

/**
 * Renderiza a lista de projetos no painel admin
 */
async function renderAdminProjects() {
    const listEl = document.getElementById('admin-projects-list');
    if (!listEl) return;

    const { data: projects, error } = await window.supabaseClient
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Erro ao listar projetos:', error);
        return;
    }

    listEl.innerHTML = projects.map((p, index) => `
        <div class="project-list-item">
            <div style="display: flex; gap: 15px; align-items: center;">
                <img src="${p.image_url}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
                <div>
                    <strong>${p.title}</strong>
                    <p style="font-size: 0.8rem; color: #aaa;">${p.description ? p.description.substring(0, 50) + '...' : ''}</p>
                </div>
            </div>
            <div style="display: flex; gap: 10px;">
                <button class="delete-btn" style="background: rgba(59, 130, 246, 0.2); color: #3b82f6;" onclick="window.editProject(${index})">
                    <i class="ph ph-pencil"></i>
                </button>
                <button class="delete-btn" onclick="window.deleteProjectDB(${p.id})">
                    <i class="ph ph-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    // Armazena para edição
    window.adminProjects = projects;
}

/**
 * Deleta um projeto do banco
 */
window.deleteProjectDB = async (id) => {
    if (!confirm('Deseja realmente excluir este projeto?')) return;

    const { error } = await window.supabaseClient
        .from('projects')
        .delete()
        .eq('id', id);

    if (error) {
        alert('Erro ao deletar: ' + error.message);
    } else {
        alert('Projeto removido!');
        renderAdminProjects();
    }
};

// Expõe para o escopo global o que for necessário
window.renderAdminProjects = renderAdminProjects;
window.uploadFile = uploadFile;
