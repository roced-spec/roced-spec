let config = {};

// Load config and initialize
async function init() {
    try {
        const response = await fetch('./config.json');
        config = await response.json();
        
        document.title = config.site.title;
        updateStaticElements();
        createNavigation();
        createSections();
        
        // Initialize scroll spy after everything is created
        setTimeout(() => {
            initScrollSpy();
        }, 100);
    } catch (error) {
        console.error('Error loading config:', error);
    }
}

// Update static elements from config
function updateStaticElements() {
    // Update logo
    document.querySelector('.logo').textContent = config.site.logo;
    
    // Update theme selector
    const themeSelect = document.querySelector('.theme-selector select');
    themeSelect.innerHTML = config.themes.map(theme => 
        `<option value="${theme.value}">${theme.label}</option>`
    ).join('');
    
    // Update footer
    document.querySelector('.footer-logo').textContent = config.site.logo;
    document.querySelector('.footer-bottom p').textContent = config.site.copyright;
    
    // Update footer links
    const footerLinks = document.querySelector('.footer-links');
    footerLinks.innerHTML = config.sectionOrder.map(sectionId => 
        `<a href="#${sectionId}">${config.sections[sectionId].navLabel}</a>`
    ).join('');
    
    // Update footer social links
    const footerSocial = document.querySelector('.footer-social');
    footerSocial.innerHTML = config.personal.social.map(social => 
        `<a href="${social.url}" title="${social.platform}"><i class="${social.icon}"></i></a>`
    ).join('');
}

// Create navigation from config
function createNavigation() {
    const navMenu = document.getElementById('nav-menu');
    navMenu.innerHTML = '';
    
    config.sectionOrder.forEach((sectionId, index) => {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.className = 'nav-link' + (index === 0 ? ' active' : '');
        button.textContent = config.sections[sectionId].navLabel;
        button.setAttribute('data-section', sectionId);
        button.onclick = () => scrollToSection(sectionId);
        li.appendChild(button);
        navMenu.appendChild(li);
    });
}

// Create sections from config
function createSections() {
    const main = document.getElementById('main-content');
    main.innerHTML = '';
    
    config.sectionOrder.forEach(sectionId => {
        const section = document.createElement('section');
        section.id = sectionId;
        
        if (sectionId === 'home') {
            section.className = 'hero';
        }
        
        section.innerHTML = getSectionHTML(sectionId);
        main.appendChild(section);
    });
    
    // Generate filter buttons after projects section is created
    setTimeout(() => {
        generateFilterButtons();
    }, 100);
}

// Get HTML for each section
function getSectionHTML(sectionId) {
    switch(sectionId) {
        case 'home':
            return `
                <div class="container">
                    <div class="hero-content">
                        <h1>${config.personal.name}</h1>
                        <p class="subtitle">${config.personal.title}</p>
                        <div class="code-block">
                            <div class="terminal-header">
                                <div class="terminal-dot dot-red"></div>
                                <div class="terminal-dot dot-yellow"></div>
                                <div class="terminal-dot dot-green"></div>
                            </div>
                            <div>const developer = {</div>
                            <div>&nbsp;&nbsp;name: "${config.personal.name}",</div>
                            <div>&nbsp;&nbsp;role: "${config.personal.title}",</div>
                            <div>&nbsp;&nbsp;location: "${config.personal.location}",</div>
                            <div>&nbsp;&nbsp;experience: "${config.personal.experience}",</div>
                            <div>&nbsp;&nbsp;passion: "${config.personal.passion}"</div>
                            <div>};</div>
                        </div>
                        <div class="cta-buttons">
                            <a href="#projects" class="btn btn-primary">${config.sections.home.cta.primary}</a>
                            <a href="#contact" class="btn btn-secondary">${config.sections.home.cta.secondary}</a>
                        </div>
                    </div>
                </div>
            `;
        case 'about':
            return `
                <div class="container">
                    <h2 class="section-title">${config.sections.about.title}</h2>
                    <div class="about-content">
                        <div class="about-text">
                            ${config.personal.bio.map(p => `<p>${p}</p>`).join('')}
                            <div class="stats">
                                ${config.personal.stats.map(stat => 
                                    `<div class="stat"><div class="stat-number">${stat.number}</div><div>${stat.label}</div></div>`
                                ).join('')}
                            </div>
                        </div>
                        <div class="terminal">
                            <div class="terminal-header">
                                <div class="terminal-dot dot-red"></div>
                                <div class="terminal-dot dot-yellow"></div>
                                <div class="terminal-dot dot-green"></div>
                            </div>
                            <div class="terminal-line">
                                <span class="prompt">dev@portfolio:~$</span> whoami
                            </div>
                            <div class="terminal-line">Full-Stack Developer</div>
                            <div class="terminal-line">
                                <span class="prompt">dev@portfolio:~$</span> ls skills/
                            </div>
                            <div class="terminal-line">frontend/ backend/ devops/ tools/</div>
                            <div class="terminal-line">
                                <span class="prompt">dev@portfolio:~$</span> cat status.txt
                            </div>
                            <div class="terminal-line">Currently: Building amazing things</div>
                            <div class="terminal-line">Status: Available for opportunities</div>
                            <div class="terminal-line">
                                <span class="prompt">dev@portfolio:~$</span> <span class="cursor">_</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        case 'experience':
            return `
                <div class="container">
                    <h2 class="section-title">${config.sections.experience.title}</h2>
                    <div class="timeline">
                        ${config.experience.map(exp => `
                            <div class="timeline-item">
                                <div class="timeline-content">
                                    <div class="timeline-dot"></div>
                                    <h3 class="experience-title">${exp.title}</h3>
                                    <h4 class="experience-company">${exp.company}</h4>
                                    <p class="experience-period">${exp.period}</p>
                                    <p class="experience-description">${exp.description}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        case 'projects':
            return `
                <div class="container">
                    <h2 class="section-title">${config.sections.projects.title}</h2>
                    <div class="filter-buttons" id="filterButtons" style="text-align: center; margin-bottom: 2rem;"></div>
                    <div class="projects-grid">
                        ${config.projects.map(project => `
                            <div class="project-card">
                                <h3 class="project-title">${project.title}</h3>
                                <p class="project-description">${project.description}</p>
                                <div class="project-tech">
                                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                                </div>
                                <div class="project-links">
                                    <a href="#" class="project-link"><i class="fab fa-github"></i> GitHub</a>
                                    <a href="#" class="project-link"><i class="fas fa-external-link-alt"></i> Live Demo</a>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        case 'skills':
            return `
                <div class="container">
                    <h2 class="section-title">${config.sections.skills.title}</h2>
                    <div class="skills-grid">
                        ${config.skills.map(skill => `
                            <div class="skill-card">
                                <div class="skill-icon"><i class="${skill.icon}"></i></div>
                                <h3 class="skill-title">${skill.title}</h3>
                                <div class="skill-tags">
                                    ${skill.technologies.map(tech => `<span class="skill-tag">${tech}</span>`).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        case 'contact':
            return `
                <div class="container">
                    <h2 class="section-title">${config.sections.contact.title}</h2>
                    <div class="contact-content">
                        <div class="contact-info">
                            <div class="contact-item">
                                <i class="fas fa-envelope contact-icon"></i>
                                <div><h4>Email</h4><p>${config.personal.email}</p></div>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-phone contact-icon"></i>
                                <div><h4>Phone</h4><p>${config.personal.phone}</p></div>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-map-marker-alt contact-icon"></i>
                                <div><h4>Location</h4><p>${config.personal.location}</p></div>
                            </div>
                            <div class="social-links">
                                ${config.personal.social.map(social => 
                                    `<a href="${social.url}" class="social-link" title="${social.platform}">
                                        <i class="${social.icon}"></i>
                                    </a>`
                                ).join('')}
                            </div>
                        </div>
                        <form class="contact-form" id="contactForm">
                            <div class="form-group">
                                <label for="name">Name</label>
                                <input type="text" id="name" name="name" required>
                                <div class="form-error" id="nameError">Please enter your name</div>
                            </div>
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="email" id="email" name="email" required>
                                <div class="form-error" id="emailError">Please enter a valid email</div>
                            </div>
                            <div class="form-group">
                                <label for="message">Message</label>
                                <textarea id="message" name="message" required></textarea>
                                <div class="form-error" id="messageError">Please enter your message</div>
                            </div>
                            <button type="submit" class="btn btn-primary">Send Message</button>
                        </form>
                    </div>
                    <div class="contact-message" style="text-align: center; margin-top: 2rem; padding: 2rem 0 1rem 0; color: var(--text-secondary);">
                        <p style="font-size: 1.2rem; margin-bottom: 1rem;">${config.contact.message.heading}</p>
                        <p>${config.contact.message.subtext}</p>
                    </div>
                </div>
            `;
        default:
            return '';
    }
}

// Project filtering functionality
let activeFilters = [];

function generateFilterButtons() {
    const filterContainer = document.getElementById('filterButtons');
    if (!filterContainer) return;
    
    const projects = document.querySelectorAll('.project-card');
    const allTechs = new Set();
    
    projects.forEach(project => {
        const techTags = project.querySelectorAll('.tech-tag');
        techTags.forEach(tag => {
            allTechs.add(tag.textContent.trim());
        });
    });
    
    filterContainer.innerHTML = '';
    Array.from(allTechs).sort().forEach(tech => {
        const button = document.createElement('button');
        button.className = 'filter-btn';
        button.textContent = tech;
        button.onclick = () => filterProjects(tech.toLowerCase());
        button.style.cssText = 'background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border); padding: 0.5rem 1rem; margin: 0.25rem; border-radius: 20px; cursor: pointer;';
        filterContainer.appendChild(button);
    });
}

function filterProjects(tech) {
    const projects = document.querySelectorAll('.project-card');
    
    if (activeFilters.includes(tech)) {
        activeFilters = activeFilters.filter(f => f !== tech);
        event.target.style.background = 'var(--bg-tertiary)';
        event.target.style.color = 'var(--text-primary)';
    } else {
        activeFilters.push(tech);
        event.target.style.background = 'var(--accent)';
        event.target.style.color = 'var(--bg-primary)';
    }
    
    projects.forEach(project => {
        if (activeFilters.length === 0) {
            project.style.display = 'block';
        } else {
            const techTags = project.querySelectorAll('.tech-tag');
            let hasAnyTech = false;
            
            activeFilters.forEach(filter => {
                techTags.forEach(tag => {
                    if (tag.textContent.toLowerCase().includes(filter.toLowerCase())) {
                        hasAnyTech = true;
                    }
                });
            });
            
            project.style.display = hasAnyTech ? 'block' : 'none';
        }
    });
}

// Scroll spy for navigation
function initScrollSpy() {
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    });
}

// Utility functions
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({behavior: 'smooth'});
    document.querySelector('.nav-links').classList.remove('show');
}

function toggleMobileMenu() {
    document.querySelector('.nav-links').classList.toggle('show');
}

function changeTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

// Initialize theme
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'github';
    document.body.setAttribute('data-theme', savedTheme);
    
    setTimeout(() => {
        const themeSelector = document.querySelector('.theme-selector select');
        if (themeSelector) themeSelector.value = savedTheme;
    }, 100);
});

// Initialize app
init();
