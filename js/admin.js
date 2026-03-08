/* ============================================
   ADMIN.JS — Dashboard Logic
   ============================================ */

(function () {
    'use strict';

    // --- Auth ---
    var CREDENTIALS = { id: 'meyad', passHash: '5a7d4c8b' }; // simple hash

    function simpleHash(str) {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            var char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash |= 0;
        }
        return Math.abs(hash).toString(16).slice(0, 8);
    }

    // Pre-compute hash for 'meyad@2026'
    // simpleHash('meyad@2026') => we compute it once
    CREDENTIALS.passHash = simpleHash('meyad@2026');

    var loginScreen = document.getElementById('loginScreen');
    var dashboard = document.getElementById('dashboard');
    var loginForm = document.getElementById('loginForm');
    var loginError = document.getElementById('loginError');

    // Check session
    if (sessionStorage.getItem('admin_auth') === 'true') {
        showDashboard();
    }

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var id = document.getElementById('loginId').value.trim();
        var pass = document.getElementById('loginPass').value;

        if (id === CREDENTIALS.id && simpleHash(pass) === CREDENTIALS.passHash) {
            sessionStorage.setItem('admin_auth', 'true');
            loginError.textContent = '';
            showDashboard();
        } else {
            loginError.textContent = 'Invalid credentials. Please try again.';
        }
    });

    document.getElementById('logoutBtn').addEventListener('click', function () {
        sessionStorage.removeItem('admin_auth');
        dashboard.style.display = 'none';
        loginScreen.style.display = 'flex';
    });

    function showDashboard() {
        loginScreen.style.display = 'none';
        dashboard.style.display = 'block';
        loadAllData();
    }

    // --- Sidebar Navigation ---
    var sidebarBtns = document.querySelectorAll('.sidebar-btn');
    sidebarBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            sidebarBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

            document.querySelectorAll('.dash-section').forEach(function (s) { s.classList.remove('active'); });
            var target = document.getElementById('sec-' + btn.dataset.section);
            if (target) target.classList.add('active');
        });
    });

    // --- Default portfolio data (mirrors index.html) ---
    var DEFAULT_DATA = {
        hero: {
            label: 'AI Systems & Automation',
            name1: 'Abdullah',
            name2: 'Al Meyad',
            tagline: 'Intelligent Workflow Architect — building scalable AI-driven systems, LLM-based solutions, and seamless automation architectures.'
        },
        about: {
            title: '',
            bio1: 'AI Automation Engineer with hands-on programming experience in backend development, API integrations, and AI-driven workflow automation. Skilled in designing scalable systems, implementing LLM-based solutions, and connecting multiple platforms to create seamless, data-driven automation architectures.',
            bio2: 'Currently at Octopi Digital LLC, I design and deploy AI-driven automation systems using GHL, n8n, Make, Zapier, Vapi, SimpleTalk, and Retell AI — building CRM workflows, API integrations, and AI voice agents to streamline operations and improve client conversion processes.',
            location: 'Dhaka, Bangladesh'
        },
        projects: [
            { title: 'Easy Travel', category: 'Desktop Application', desc: 'Java Swing academic project for travel management', tags: ['Java', 'Swing', 'OOP'], icon: '', image: 'images/projects/easy-travel.webp' },
            { title: 'Blood Bank System', category: 'Database / Backend', desc: 'MySQL-based academic project for blood bank operations', tags: ['MySQL', 'Database Design'], icon: '', image: 'images/projects/blood-bank.webp' },
            { title: 'Cafe Management', category: 'Desktop Application', desc: 'C# desktop project for cafe operations', tags: ['C#', '.NET', 'OOP'], icon: '', image: 'images/projects/cafe-management.webp' },
            { title: 'Radhuni Chatbot', category: 'AI / Automation', desc: 'AI automation chatbot for restaurant orders', tags: ['N8n', 'AI Agents'], icon: '', image: 'images/projects/radhuni-chatbot.webp' },
            { title: 'Chakribakri', category: 'Full-Stack Development', desc: 'Full-stack job portal for job seekers and employers', tags: ['Spring Boot', 'MySQL', 'JS'], icon: '', image: 'images/projects/chakribakri.webp' },
            { title: 'Diabetes Prediction', category: 'Data Science / ML', desc: 'Data Science academic project for diabetes prediction using ML', tags: ['Python', 'Pandas', 'Scikit Learn'], icon: '', image: 'images/projects/diabetes-pred.webp' },
            { title: 'E-Commerce Automation System', category: 'AI / Automation', desc: 'Multi-channel e-commerce automation with order processing, customer support, and notifications across platforms', tags: ['n8n', 'Zapier', 'WooCommerce', 'Messenger', 'WhatsApp', 'Telegram'], icon: '', image: 'images/projects/ecommerce-automation.webp' },
            { title: 'Martial Arts Academy Follow-Up', category: 'AI / Automation', desc: 'Automated email follow-up system for martial arts academy using GHL to n8n pipeline with Spark membership integration', tags: ['Go High Level', 'n8n', 'Spark Membership', 'Email Automation'], icon: '', image: 'images/projects/martial-arts-followup.webp' },
            { title: 'Healthcare Chatbot', category: 'AI / Automation', desc: 'AI-powered healthcare chatbot using GHL and n8n with real-time data fetching from Go High Level CRM', tags: ['Go High Level', 'n8n', 'AI Chatbot', 'Healthcare'], icon: '', image: 'images/projects/healthcare-chatbot.webp' },
            { title: 'CRM with OpenClaw & Subagents', category: 'AI / CRM', desc: 'Custom CRM system built with OpenClaw and AI subagents for intelligent lead management and automated workflows', tags: ['OpenClaw', 'AI Agents', 'CRM', 'Subagents'], icon: '', image: 'images/projects/crm-openclaw.webp' },
            { title: 'GHL Client Automation', category: 'Client Work', desc: 'Go High Level automation and workflow setup for client business operations, lead funnels, and CRM management', tags: ['Go High Level', 'CRM', 'Automation'], icon: '', image: 'images/projects/ghl-client-work.webp' },
            { title: 'Client Workflow Automation', category: 'Client Work', desc: 'End-to-end workflow automation and integration system built for client business process optimization', tags: ['n8n', 'Automation', 'API Integration'], icon: '', image: 'images/projects/client-automation.webp' },
            { title: 'Resume Extractor & ATS Checker', category: 'AI / Automation', desc: 'AI-powered resume extractor, ATS compatibility checker, and resume builder automated with n8n workflows', tags: ['n8n', 'AI', 'ATS', 'Resume Builder'], icon: '', image: 'images/projects/resume-extractor.webp' },
            { title: 'HR Management System', category: 'AI / Automation', desc: 'Automated HR management system built with n8n for employee onboarding, leave management, and attendance tracking', tags: ['n8n', 'HR', 'Automation'], icon: '', image: 'images/projects/hr-management.webp' },
            { title: 'Project Tracker', category: 'Full-Stack Development', desc: 'Project management and task tracking application built with vibe coding — real-time collaboration and progress monitoring', tags: ['Vibe Coding', 'Full-Stack', 'Project Management'], icon: '', image: 'images/projects/project-tracker.webp' }
        ],
        skills: [
            { title: 'Programming Languages', tags: ['Java', 'Python', 'C / C++', 'C#', 'JavaScript', 'PHP', 'R', 'HTML/CSS', 'Dart'] },
            { title: 'Backend & Frameworks', tags: ['Spring Boot', '.NET', 'Maven', 'Gradle', 'React'] },
            { title: 'AI & Machine Learning', tags: ['RAG', 'NLP', 'Machine Learning', 'Agentic AI', 'Data Science', 'Data Mining'] },
            { title: 'Automation & Integration', tags: ['n8n', 'Zapier', 'Make', 'Go High Level', 'REST APIs', 'Postman'] },
            { title: 'Databases', tags: ['MySQL', 'PostgreSQL', 'MongoDB', 'SQL Server'] }
        ],
        education: [
            { title: 'AI Automation Engineer', institution: 'Octopi Digital LLC', detail: 'January 2026 — Present', desc: 'Design and deploy AI-driven automation systems using GHL, n8n, Make, Zapier, Vapi, SimpleTalk, and Retell AI. Build CRM workflows, API integrations, and AI voice agents to streamline operations, automate lead management, and improve client conversion processes.', badge: 'Present' },
            { title: 'Bachelor of Science in Computer Science and Engineering', institution: 'American International University-Bangladesh (AIUB)', detail: '11th Semester  |  CGPA: 3.78', desc: '', badge: 'Ongoing' },
            { title: 'Higher Secondary Certificate (HSC)', institution: 'Mirpur Cantonment Public School and College', detail: 'GPA: 5.00 / 5.00', desc: '', badge: '' },
            { title: 'Secondary School Certificate (SSC)', institution: 'Mirpur Cantonment Public School and College', detail: 'GPA: 4.89 / 5.00', desc: '', badge: '' }
        ],
        certifications: [
            { title: 'The Ultimate Java Programming Course', desc: 'Comprehensive Java programming course from Udemy', icon: 'ðŸ“œ', link: '#' },
            { title: 'Python Development Fundamentals', desc: 'Comprehensive Python course by MTF Institute', icon: 'ðŸ“œ', link: '#' },
            { title: "Dean's List Honors", desc: 'Faculty of Science and Technology, AIUB', icon: 'ðŸ†', link: '' },
            { title: 'MAGNE.Q Fest Achievement', desc: 'Mirpur Cantonment Public School & College', icon: 'ðŸ…', link: '' }
        ],
        contact: {
            email: 'abdullahmeyad7@gmail.com',
            linkedin: 'https://www.linkedin.com/in/abdullah-al-meyad',
            github: 'https://github.com/AbdullahMeyad',
            phone: '+8801516569243'
        },
        chatbot: {
            webhookUrl: '',
            greeting: ''
        },
        contactForm: {
            webhookUrl: ''
        }
    };

    // --- Data Management ---
    function getData() {
        var defaults = JSON.parse(JSON.stringify(DEFAULT_DATA));
        try {
            var stored = JSON.parse(localStorage.getItem('portfolio_content'));
            if (stored && typeof stored === 'object') {
                // Merge: stored sections override defaults, missing sections keep defaults
                for (var key in stored) {
                    if (stored.hasOwnProperty(key)) {
                        defaults[key] = stored[key];
                    }
                }
            }
        } catch (e) { /* use defaults */ }
        return defaults;
    }

    function setData(data) {
        localStorage.setItem('portfolio_content', JSON.stringify(data));
    }

    // --- Export / Import ---
    document.getElementById('exportBtn').addEventListener('click', function () {
        var data = getData();
        var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'config.json';
        a.click();
        URL.revokeObjectURL(a.href);
        showToast('Config exported! Save it to your project folder and push to deploy.');
    });

    document.getElementById('importBtn').addEventListener('click', function () {
        document.getElementById('importFile').click();
    });

    document.getElementById('importFile').addEventListener('change', function (e) {
        var file = e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function (ev) {
            try {
                var data = JSON.parse(ev.target.result);
                if (data && typeof data === 'object') {
                    setData(data);
                    loadAllData();
                    showToast('Config imported successfully!');
                } else {
                    showToast('Invalid config file.');
                }
            } catch (err) {
                showToast('Error reading file.');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    });

    function showToast(msg) {
        var toast = document.getElementById('toast');
        toast.textContent = msg || 'Saved successfully!';
        toast.classList.add('show');
        setTimeout(function () { toast.classList.remove('show'); }, 2500);
    }

    // --- Load Data into Forms ---
    function loadAllData() {
        var data = getData();

        // Hero
        if (data.hero) {
            document.getElementById('heroLabel').value = data.hero.label || '';
            document.getElementById('heroName1').value = data.hero.name1 || '';
            document.getElementById('heroName2').value = data.hero.name2 || '';
            document.getElementById('heroTagline').value = data.hero.tagline || '';
        }

        // About
        if (data.about) {
            document.getElementById('aboutTitle').value = data.about.title || '';
            document.getElementById('aboutBio1').value = data.about.bio1 || '';
            document.getElementById('aboutBio2').value = data.about.bio2 || '';
            document.getElementById('aboutLocation').value = data.about.location || '';
        }

        // Contact
        if (data.contact) {
            document.getElementById('contactEmail').value = data.contact.email || '';
            document.getElementById('contactLinkedin').value = data.contact.linkedin || '';
            document.getElementById('contactGithub').value = data.contact.github || '';
            document.getElementById('contactPhone').value = data.contact.phone || '';
        }

        // Chatbot
        if (data.chatbot) {
            document.getElementById('webhookUrl').value = data.chatbot.webhookUrl || '';
            document.getElementById('chatbotGreeting').value = data.chatbot.greeting || '';
        }

        // Contact Form
        if (data.contactForm) {
            document.getElementById('contactFormWebhook').value = data.contactForm.webhookUrl || '';
        }

        // Projects
        loadProjects(data.projects || []);

        // Skills
        loadSkills(data.skills || []);

        // Education
        loadEducation(data.education || []);

        // Certifications
        loadCerts(data.certifications || []);
    }

    // --- Save Section ---
    window.saveSection = function (section) {
        var data = getData();

        switch (section) {
            case 'hero':
                data.hero = {
                    label: document.getElementById('heroLabel').value,
                    name1: document.getElementById('heroName1').value,
                    name2: document.getElementById('heroName2').value,
                    tagline: document.getElementById('heroTagline').value
                };
                break;

            case 'about':
                data.about = {
                    title: document.getElementById('aboutTitle').value,
                    bio1: document.getElementById('aboutBio1').value,
                    bio2: document.getElementById('aboutBio2').value,
                    location: document.getElementById('aboutLocation').value
                };
                break;

            case 'projects':
                data.projects = collectProjects();
                break;

            case 'skills':
                data.skills = collectSkills();
                break;

            case 'education':
                data.education = collectEducation();
                break;

            case 'certifications':
                data.certifications = collectCerts();
                break;

            case 'contact':
                data.contact = {
                    email: document.getElementById('contactEmail').value,
                    linkedin: document.getElementById('contactLinkedin').value,
                    github: document.getElementById('contactGithub').value,
                    phone: document.getElementById('contactPhone').value
                };
                break;

            case 'chatbot':
                data.chatbot = {
                    webhookUrl: document.getElementById('webhookUrl').value,
                    greeting: document.getElementById('chatbotGreeting').value
                };
                break;

            case 'contactform':
                data.contactForm = {
                    webhookUrl: document.getElementById('contactFormWebhook').value
                };
                break;
        }

        setData(data);
        showToast('Saved successfully!');
    };

    // --- Projects ---
    var projectCount = 0;

    function loadProjects(projects) {
        var container = document.getElementById('projectsList');
        container.innerHTML = '';
        projectCount = 0;
        if (projects.length === 0) return;
        projects.forEach(function (p) {
            addProject(p);
        });
    }

    window.addProject = function (data) {
        projectCount++;
        var container = document.getElementById('projectsList');
        var card = document.createElement('div');
        card.className = 'item-card';
        card.dataset.index = projectCount;
        card.innerHTML =
            '<div class="item-card__header">' +
                '<span class="item-card__number">Project ' + projectCount + '</span>' +
                '<button class="btn-danger" onclick="this.closest(\'.item-card\').remove()">Remove</button>' +
            '</div>' +
            '<div class="form-group">' +
                '<label>Title</label>' +
                '<input type="text" class="proj-title" value="' + esc(data ? data.title : '') + '">' +
            '</div>' +
            '<div class="form-group">' +
                '<label>Category</label>' +
                '<input type="text" class="proj-category" value="' + esc(data ? data.category : '') + '" placeholder="e.g. AI / Automation">' +
            '</div>' +
            '<div class="form-group">' +
                '<label>Description</label>' +
                '<textarea class="proj-desc" rows="2">' + esc(data ? data.desc : '') + '</textarea>' +
            '</div>' +
            '<div class="form-group">' +
                '<label>Tags (comma separated)</label>' +
                '<input type="text" class="proj-tags" value="' + esc(data ? (data.tags || []).join(', ') : '') + '" placeholder="Java, Spring Boot, MySQL">' +
            '</div>' +
            '<div class="form-group">' +
                '<label>Image Path (e.g. images/projects/my-project.webp)</label>' +
                '<input type="text" class="proj-image" value="' + esc(data ? data.image : '') + '" placeholder="images/projects/project-name.webp">' +
            '</div>';
        container.appendChild(card);
    };

    function collectProjects() {
        var cards = document.querySelectorAll('#projectsList .item-card');
        var projects = [];
        cards.forEach(function (card) {
            projects.push({
                title: card.querySelector('.proj-title').value,
                category: card.querySelector('.proj-category').value,
                desc: card.querySelector('.proj-desc').value,
                tags: card.querySelector('.proj-tags').value.split(',').map(function (t) { return t.trim(); }).filter(Boolean),
                icon: '',
                image: card.querySelector('.proj-image').value
            });
        });
        return projects;
    }

    // --- Skills ---
    var skillGroupCount = 0;

    function loadSkills(skills) {
        var container = document.getElementById('skillsList');
        container.innerHTML = '';
        skillGroupCount = 0;
        if (skills.length === 0) return;
        skills.forEach(function (s) {
            addSkillGroup(s);
        });
    }

    window.addSkillGroup = function (data) {
        skillGroupCount++;
        var container = document.getElementById('skillsList');
        var card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML =
            '<div class="item-card__header">' +
                '<span class="item-card__number">Group ' + skillGroupCount + '</span>' +
                '<button class="btn-danger" onclick="this.closest(\'.item-card\').remove()">Remove</button>' +
            '</div>' +
            '<div class="form-group">' +
                '<label>Group Title</label>' +
                '<input type="text" class="skill-group-title" value="' + esc(data ? data.title : '') + '" placeholder="Programming Languages">' +
            '</div>' +
            '<div class="form-group">' +
                '<label>Skills (comma separated)</label>' +
                '<input type="text" class="skill-group-tags" value="' + esc(data ? (data.tags || []).join(', ') : '') + '" placeholder="Java, Python, C++">' +
            '</div>';
        container.appendChild(card);
    };

    function collectSkills() {
        var cards = document.querySelectorAll('#skillsList .item-card');
        var skills = [];
        cards.forEach(function (card) {
            skills.push({
                title: card.querySelector('.skill-group-title').value,
                tags: card.querySelector('.skill-group-tags').value.split(',').map(function (t) { return t.trim(); }).filter(Boolean)
            });
        });
        return skills;
    }

    // --- Education ---
    var eduCount = 0;

    function loadEducation(entries) {
        var container = document.getElementById('educationList');
        container.innerHTML = '';
        eduCount = 0;
        if (entries.length === 0) return;
        entries.forEach(function (e) {
            addEducation(e);
        });
    }

    window.addEducation = function (data) {
        eduCount++;
        var container = document.getElementById('educationList');
        var card = document.createElement('div');
        card.className = 'item-card';
        card.draggable = true;
        card.innerHTML =
            '<div class="item-card__header">' +
                '<span class="drag-handle" title="Drag to reorder">&#9776;</span>' +
                '<span class="item-card__number">Entry ' + eduCount + '</span>' +
                '<button class="btn-danger" onclick="this.closest(\'.item-card\').remove(); renumberEducation()">Remove</button>' +
            '</div>' +
            '<div class="form-group">' +
                '<label>Title</label>' +
                '<input type="text" class="edu-title" value="' + esc(data ? data.title : '') + '">' +
            '</div>' +
            '<div class="form-group">' +
                '<label>Institution / Company</label>' +
                '<input type="text" class="edu-institution" value="' + esc(data ? data.institution : '') + '">' +
            '</div>' +
            '<div class="form-group">' +
                '<label>Detail (e.g. GPA, date range)</label>' +
                '<input type="text" class="edu-detail" value="' + esc(data ? data.detail : '') + '">' +
            '</div>' +
            '<div class="form-group">' +
                '<label>Description (optional)</label>' +
                '<textarea class="edu-desc" rows="2">' + esc(data ? data.desc : '') + '</textarea>' +
            '</div>' +
            '<div class="form-group">' +
                '<label>Badge (e.g. Ongoing, Present — leave empty for none)</label>' +
                '<input type="text" class="edu-badge" value="' + esc(data ? data.badge : '') + '">' +
            '</div>';
        container.appendChild(card);
    };

    // Re-number education entries after drag/remove
    window.renumberEducation = function () {
        var cards = document.querySelectorAll('#educationList .item-card');
        cards.forEach(function (card, i) {
            card.querySelector('.item-card__number').textContent = 'Entry ' + (i + 1);
        });
        eduCount = cards.length;
    };

    // Drag & drop for education list
    (function () {
        var list = document.getElementById('educationList');
        var dragItem = null;

        list.addEventListener('dragstart', function (e) {
            var card = e.target.closest('.item-card');
            if (!card) return;
            dragItem = card;
            card.classList.add('item-card--dragging');
            e.dataTransfer.effectAllowed = 'move';
        });

        list.addEventListener('dragend', function () {
            if (dragItem) {
                dragItem.classList.remove('item-card--dragging');
                dragItem = null;
            }
            var placeholders = list.querySelectorAll('.drag-placeholder');
            placeholders.forEach(function (p) { p.remove(); });
            renumberEducation();
        });

        list.addEventListener('dragover', function (e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            var afterElement = getDragAfterElement(list, e.clientY);
            var placeholder = list.querySelector('.drag-placeholder');
            if (!placeholder) {
                placeholder = document.createElement('div');
                placeholder.className = 'drag-placeholder';
            }
            if (afterElement) {
                list.insertBefore(placeholder, afterElement);
            } else {
                list.appendChild(placeholder);
            }
        });

        list.addEventListener('drop', function (e) {
            e.preventDefault();
            var placeholder = list.querySelector('.drag-placeholder');
            if (dragItem && placeholder) {
                list.insertBefore(dragItem, placeholder);
                placeholder.remove();
            }
        });

        function getDragAfterElement(container, y) {
            var elements = Array.prototype.slice.call(container.querySelectorAll('.item-card:not(.item-card--dragging)'));
            var closest = null;
            var closestOffset = Number.NEGATIVE_INFINITY;
            elements.forEach(function (el) {
                var box = el.getBoundingClientRect();
                var offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closestOffset) {
                    closestOffset = offset;
                    closest = el;
                }
            });
            return closest;
        }
    })();

    function collectEducation() {
        var cards = document.querySelectorAll('#educationList .item-card');
        var entries = [];
        cards.forEach(function (card) {
            entries.push({
                title: card.querySelector('.edu-title').value,
                institution: card.querySelector('.edu-institution').value,
                detail: card.querySelector('.edu-detail').value,
                desc: card.querySelector('.edu-desc').value,
                badge: card.querySelector('.edu-badge').value
            });
        });
        return entries;
    }

    // --- Certifications ---
    var certCount = 0;

    function loadCerts(certs) {
        var container = document.getElementById('certsList');
        container.innerHTML = '';
        certCount = 0;
        if (certs.length === 0) return;
        certs.forEach(function (c) {
            addCert(c);
        });
    }

    window.addCert = function (data) {
        certCount++;
        var container = document.getElementById('certsList');
        var card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML =
            '<div class="item-card__header">' +
                '<span class="item-card__number">Certificate ' + certCount + '</span>' +
                '<button class="btn-danger" onclick="this.closest(\'.item-card\').remove()">Remove</button>' +
            '</div>' +
            '<div class="form-group">' +
                '<label>Title</label>' +
                '<input type="text" class="cert-title" value="' + esc(data ? data.title : '') + '">' +
            '</div>' +
            '<div class="form-group">' +
                '<label>Description</label>' +
                '<input type="text" class="cert-desc" value="' + esc(data ? data.desc : '') + '">' +
            '</div>' +
            '<div class="form-group">' +
                '<label>Icon (emoji)</label>' +
                '<input type="text" class="cert-icon" value="' + esc(data ? data.icon : '') + '" placeholder="ðŸ“œ">' +
            '</div>' +
            '<div class="form-group">' +
                '<label>Certificate Link (optional)</label>' +
                '<input type="url" class="cert-link" value="' + esc(data ? data.link : '') + '" placeholder="https://...">' +
            '</div>';
        container.appendChild(card);
    };

    function collectCerts() {
        var cards = document.querySelectorAll('#certsList .item-card');
        var certs = [];
        cards.forEach(function (card) {
            certs.push({
                title: card.querySelector('.cert-title').value,
                desc: card.querySelector('.cert-desc').value,
                icon: card.querySelector('.cert-icon').value,
                link: card.querySelector('.cert-link').value
            });
        });
        return certs;
    }

    // --- Utility - Escape HTML attribute values ---
    function esc(str) {
        if (!str) return '';
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML.replace(/"/g, '&quot;');
    }

})();
