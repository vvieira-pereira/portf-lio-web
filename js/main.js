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
    setupMobileMenu();
    setupLightbox();
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

function loadHero() {
    const heroData = JSON.parse(localStorage.getItem('portfolio_hero')) || {};
    const titleEl = document.getElementById('editable-hero-title');
    const subtitleEl = document.getElementById('editable-hero-subtitle');
    const photoEl = document.getElementById('editable-hero-photo');

    if (titleEl) titleEl.innerHTML = heroData.title;
    if (subtitleEl) subtitleEl.innerText = heroData.subtitle;
    if (photoEl && heroData.photoUrl) photoEl.src = heroData.photoUrl;
}

function loadProjects() {
    const projectsContainer = document.getElementById('projects-container');
    if (!projectsContainer) return;

    const projects = JSON.parse(localStorage.getItem('portfolio_projects')) || [];

    projectsContainer.innerHTML = projects.map((project, index) => `
        <div class="project-card" onclick="window.openProjectModal(${index})">
            <img src="${project.image}" alt="${project.title}" class="project-image">
            <div class="project-info">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-desc">${project.desc}</p>
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
        const projects = JSON.parse(localStorage.getItem('portfolio_projects')) || [];
        const project = projects[index];
        if (!project) return;

        // Populate Data - Correct ID: modal-cover
        const cover = document.getElementById('modal-cover');
        if (cover) cover.src = project.image;

        const title = document.getElementById('modal-title');
        if (title) title.innerText = project.title;

        const desc = document.getElementById('modal-desc');
        if (desc) desc.innerText = project.desc;

        // Specs
        const specsContainer = document.getElementById('modal-specs');
        if (specsContainer) {
            specsContainer.innerHTML = project.specs
                ? project.specs.split(',').map(tech => `<span class="spec-tag">${tech.trim()}</span>`).join('')
                : '';
        }

        // Links - Correct IDs: modal-link-project, modal-link-figma
        const linkBtn = document.getElementById('modal-link-project');
        const figmaBtn = document.getElementById('modal-link-figma');

        // Helper to reset button style
        const resetBtnStyle = (btn, iconClass, text) => {
            btn.style.display = 'inline-flex';
            btn.className = 'btn btn-primary'; // Default for project
            if (iconClass.includes('figma')) btn.className = 'btn btn-outline'; // Default for figma
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

        // Helper to set "No Link" style
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

        if (linkBtn) {
            if (project.linkProject && project.linkProject.trim() !== '') {
                resetBtnStyle(linkBtn, 'ph-globe', 'Ver Projeto');
                linkBtn.href = project.linkProject;
                linkBtn.target = '_blank';
            } else {
                setNoLinkStyle(linkBtn, 'Não há link disponível');
            }
        }

        if (figmaBtn) {
            // Always show button style
            resetBtnStyle(figmaBtn, 'ph-figma-logo', 'Ver Figma');

            if (project.linkFigma && project.linkFigma.trim() !== '') {
                // Has link
                figmaBtn.href = project.linkFigma;
                figmaBtn.target = '_blank';
                figmaBtn.onclick = null; // Clear previous handlers
                figmaBtn.style.opacity = '1';
                figmaBtn.style.cursor = 'pointer';
            } else {
                // No link
                figmaBtn.removeAttribute('href');
                figmaBtn.removeAttribute('target');
                figmaBtn.style.opacity = '0.7'; // Slightly dimmer to indicate difference? Or keep same. User asked for "button back".
                figmaBtn.style.cursor = 'pointer';
                figmaBtn.onclick = (e) => {
                    e.preventDefault();
                    alert('Não há projeto no Figma disponível para este item.');
                };
            }
        }

        // Gallery Rendering - Correct ID: modal-gallery
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
            if (project.galleryFigma && project.galleryFigma.length > 0) {
                htmlContent += `<h3 style="margin: 30px 0 10px; font-size: 1.1rem; color: #ea580c; width: 100%;">Galeria Design / Figma</h3>`;
                htmlContent += project.galleryFigma.map(img =>
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
