// Default Data
const defaultProjects = [
    {
        id: 1,
        title: "E-commerce Moderno",
        desc: "Plataforma completa de vendas com React e Stripe. Inclui carrinho, checkout e painel administrativo.",
        specs: "React, Node.js, Stripe, TailwindCSS",
        linkProject: "https://google.com",
        linkFigma: "https://figma.com",
        image: "https://placehold.co/600x400/1a1a1a/FFF?text=E-commerce",
        gallery: [
            "https://placehold.co/600x400/222/FFF?text=Dashboard",
            "https://placehold.co/600x400/222/FFF?text=Mobile+View"
        ]
    },
    {
        id: 2,
        title: "App de Gestão",
        desc: "Dashboard interativo para controle de gastos pessoais com gráficos em tempo real.",
        specs: "Vue.js, Chart.js, Firebase",
        linkProject: "#",
        linkFigma: "#",
        image: "https://placehold.co/600x400/1a1a1a/FFF?text=Financas",
        gallery: []
    }
];

// Initialize Data if empty
if (!localStorage.getItem('portfolio_projects')) {
    localStorage.setItem('portfolio_projects', JSON.stringify(defaultProjects));
}

if (!localStorage.getItem('portfolio_hero')) {
    localStorage.setItem('portfolio_hero', JSON.stringify({
        title: 'Transformando ideias em <br> <span class="gradient-text typing-effect">Experiências Digitais</span>',
        subtitle: 'Olá, sou Vinicius Vieira. Desenvolvedor apaixonado por criar soluções web modernas e impactantes.',
        photoUrl: 'https://placehold.co/400x400/222/FFF?text=Foto+Vinicius'
    }));
}

// Load Content
document.addEventListener('DOMContentLoaded', () => {
    loadBrand();
    loadTexts();
    loadHero();
    loadProjects();
    setupModal();
    setupLightbox();

    // Menu Hamburguer com delegação para garantir funcionamento
    setupMobileMenu();
});

function loadTexts() {
    const texts = JSON.parse(localStorage.getItem('portfolio_texts')) || {};

    if (texts.aboutTitle) document.getElementById('about-title').innerText = texts.aboutTitle;
    if (texts.aboutDesc) document.getElementById('about-desc').innerText = texts.aboutDesc;
    if (texts.projectsTitle) document.getElementById('projects-title').innerText = texts.projectsTitle;
    if (texts.contactTitle) document.getElementById('contact-title').innerText = texts.contactTitle;
}

function loadBrand() {
    const brand = localStorage.getItem('portfolio_brand') || 'Vinicius<span class="gradient-text">Vieira</span>';
    const logoEl = document.getElementById('brand-logo');
    if (logoEl) logoEl.innerHTML = brand;
}

function setupMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const nav = document.getElementById('nav-links');
    const links = document.querySelectorAll('.nav-links a');

    if (btn && nav) {
        btn.addEventListener('click', () => {
            nav.classList.toggle('active');

            // Icon Toggle
            const icon = btn.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.classList.replace('ph-list', 'ph-x');
            } else {
                icon.classList.replace('ph-x', 'ph-list');
            }
        });

        // Close on Link Click
        links.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                const icon = btn.querySelector('i');
                icon.classList.replace('ph-x', 'ph-list');
            });
        });
    }
}

async function loadHero() {
    // 1. Tenta carregar do LocalStorage primeiro (Rápido)
    const heroData = JSON.parse(localStorage.getItem('portfolio_hero')) || {};
    const titleEl = document.getElementById('editable-hero-title');
    const subtitleEl = document.getElementById('editable-hero-subtitle');
    const photoEl = document.getElementById('editable-hero-photo');

    if (titleEl && heroData.title) titleEl.innerHTML = heroData.title;
    if (subtitleEl && heroData.subtitle) subtitleEl.innerText = heroData.subtitle;
    if (photoEl && heroData.photoUrl) photoEl.src = heroData.photoUrl;

    // 2. Busca do Supabase para garantir dados atualizados (Sempre)
    if (window.supabaseClient) {
        try {
            const { data, error } = await window.supabaseClient
                .from('hero_section')
                .select('*')
                .limit(1)
                .single();

            if (data && !error) {
                if (titleEl) titleEl.innerHTML = data.title;
                if (subtitleEl) subtitleEl.innerText = data.subtitle;
                if (photoEl && data.photo_url) photoEl.src = data.photo_url;
                // Atualiza cache local
                localStorage.setItem('portfolio_hero', JSON.stringify({
                    title: data.title,
                    subtitle: data.subtitle,
                    photoUrl: data.photo_url
                }));
            }
        } catch (e) {
            console.warn("Hero: Supabase table not found yet or connection error.");
        }
    }
}

async function loadProjects() {
    const projectsContainer = document.getElementById('projects-container');
    if (!projectsContainer) return;

    // Busca do Supabase
    const { data: projects, error } = await window.supabaseClient
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Erro ao buscar projetos:', error);
        return;
    }

    if (!projects || projects.length === 0) {
        projectsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">Nenhum projeto encontrado.</p>';
        return;
    }

    // Armazena no window para o modal usar sem carregar de novo
    window.allProjects = projects;

    projectsContainer.innerHTML = projects.map((project, index) => `
        <div class="project-card" onclick="window.openProjectModal(${index})">
            <div class="project-image-container">
                <img src="${project.image_url}" alt="${project.title}" class="project-image">
            </div>
            <div class="project-info">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-desc">${project.description}</p>
                <span style="font-size: 0.8rem; color: var(--accent-secondary);">Clique para ver mais</span>
            </div>
        </div>
    `).join('');
}

// Modal Logic
// Lightbox functions
function setupLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-lightbox');

    // Close on X
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });
    }

    // Close on Background Click
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target !== lightboxImg) {
                lightbox.classList.remove('active');
            }
        });
    }
}

// Function exposed to open lightbox (called from dynamic gallery generation)
window.openLightbox = (src) => {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    lightbox.classList.add('active');
    lightboxImg.src = src;
};

// Modal Logic
function setupModal() {
    const modal = document.getElementById('project-modal');
    const closeBtn = document.querySelector('.close-modal');

    const close = () => {
        modal.classList.remove('modal-active');
        document.body.style.overflow = 'auto';
        // Clear gallery to prevent flicker
        setTimeout(() => {
            const grid = document.getElementById('modal-gallery');
            if (grid) grid.innerHTML = '';
        }, 300);
    };

    if (closeBtn) closeBtn.addEventListener('click', close);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) close();
        });
    }

    // Open Logic
    // Open Logic
    window.openProjectModal = (index) => {
        const project = window.allProjects ? window.allProjects[index] : null;
        if (!project) return;

        // Helpers de Estilo
        const resetBtnStyle = (btn, iconClass, text) => {
            btn.style.display = 'inline-flex';
            btn.className = 'btn btn-primary';
            if (iconClass.includes('figma')) btn.className = 'btn btn-outline';
            btn.innerHTML = `<i class="ph ${iconClass}"></i> ${text}`;
            btn.style.pointerEvents = 'auto';
            btn.style.background = '';
            btn.style.border = '';
            btn.style.color = '';
            btn.style.cursor = '';
            btn.style.fontSize = '';
            btn.style.fontStyle = '';
            btn.style.padding = '';
        };

        const setNoLinkStyle = (btn, text) => {
            btn.style.display = 'inline-flex';
            btn.removeAttribute('href');
            btn.className = '';
            btn.innerHTML = text;
            btn.style.pointerEvents = 'none';
            btn.style.background = 'transparent';
            btn.style.border = 'none';
            btn.style.color = '#666';
            btn.style.cursor = 'default';
            btn.style.fontSize = '0.9rem';
            btn.style.fontStyle = 'italic';
            btn.style.padding = '10px 0';
        };

        // Populate Data
        const cover = document.getElementById('modal-cover');
        if (cover) cover.src = project.image_url;

        const title = document.getElementById('modal-title');
        if (title) title.innerText = project.title;

        const desc = document.getElementById('modal-desc');
        if (desc) desc.innerText = project.description;

        // Specs
        const specsContainer = document.getElementById('modal-specs');
        if (specsContainer) {
            specsContainer.innerHTML = project.specs
                ? project.specs.split(',').map(tech => `<span class="spec-tag">${tech.trim()}</span>`).join('')
                : '';
        }

        // Links
        const linkBtn = document.getElementById('modal-link-project');
        const githubBtn = document.getElementById('modal-link-github');
        const figmaBtn = document.getElementById('modal-link-figma');

        if (linkBtn) {
            if (project.link_project && project.link_project.trim() !== '' && project.link_project !== '#') {
                linkBtn.style.display = 'inline-flex';
                linkBtn.href = project.link_project;
                linkBtn.target = '_blank';
            } else {
                linkBtn.style.display = 'none';
            }
        }

        if (githubBtn) {
            if (project.link_github && project.link_github.trim() !== '' && project.link_github !== '#') {
                githubBtn.style.display = 'inline-flex';
                githubBtn.href = project.link_github;
                githubBtn.target = '_blank';
            } else {
                githubBtn.style.display = 'none';
            }
        }

        if (figmaBtn) {
            if (project.link_figma && project.link_figma.trim() !== '' && project.link_figma !== '#') {
                figmaBtn.style.display = 'inline-flex';
                figmaBtn.href = project.link_figma;
                figmaBtn.target = '_blank';
            } else {
                figmaBtn.style.display = 'none';
            }
        }

        // Gallery Rendering
        const galleryGrid = document.getElementById('modal-gallery');
        if (galleryGrid) {
            let htmlContent = '';

            // Project Gallery
            if (project.gallery && project.gallery.length > 0) {
                htmlContent += `<h3 style="margin: 20px 0 10px; font-size: 1.1rem; width: 100%; color: #ddd;">Galeria do Projeto</h3>`;
                htmlContent += project.gallery.map(img =>
                    `<img src="${img}" class="gallery-img" onclick="window.openLightbox(this.src)">`
                ).join('');
            }

            // Figma Gallery
            if (project.gallery_figma && project.gallery_figma.length > 0) {
                htmlContent += `<h3 style="margin: 30px 0 10px; font-size: 1.1rem; color: #ea580c; width: 100%;">Galeria Design / Figma</h3>`;
                htmlContent += project.gallery_figma.map(img =>
                    `<img src="${img}" class="gallery-img" style="border-color: #ea580c;" onclick="window.openLightbox(this.src)">`
                ).join('');
            }

            if (htmlContent === '') {
                htmlContent = '<p style="color: #666; font-style: italic; width: 100%;">Sem imagens extras na galeria.</p>';
            }

            galleryGrid.innerHTML = htmlContent;
        }

        modal.classList.add('modal-active');
        document.body.style.overflow = 'hidden';
    };
}
