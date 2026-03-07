/* ============================================
   CONTENT-LOADER.JS — Load config from config.json + localStorage overrides
   ============================================ */

(function () {
    'use strict';

    // Fetch config.json (ships with the site), then merge localStorage on top
    fetch('config.json')
        .then(function (res) { return res.json(); })
        .then(function (fileConfig) {
            var merged = fileConfig;

            // Merge localStorage overrides on top if they exist
            try {
                var stored = JSON.parse(localStorage.getItem('portfolio_content'));
                if (stored && typeof stored === 'object') {
                    for (var key in stored) {
                        if (stored.hasOwnProperty(key)) {
                            merged[key] = stored[key];
                        }
                    }
                }
            } catch (e) { /* no overrides */ }

            applyContent(merged);
        })
        .catch(function () {
            // Fallback: try localStorage only
            try {
                var stored = JSON.parse(localStorage.getItem('portfolio_content'));
                if (stored) applyContent(stored);
            } catch (e) { /* nothing to load */ }
        });

    function applyContent(content) {
        if (!content) return;

    // --- Hero ---
    if (content.hero) {
        var heroLabel = document.querySelector('.hero__label');
        var heroLines = document.querySelectorAll('.hero__line');
        var heroTagline = document.querySelector('.hero__tagline');

        if (content.hero.label && heroLabel) heroLabel.textContent = content.hero.label;
        if (content.hero.name1 && heroLines[0]) heroLines[0].textContent = content.hero.name1;
        if (content.hero.name2 && heroLines[1]) {
            heroLines[1].innerHTML = escHtml(content.hero.name2) + '<span class="accent">.</span>';
        }
        if (content.hero.tagline && heroTagline) heroTagline.textContent = content.hero.tagline;
    }

    // --- About ---
    if (content.about) {
        var aboutTexts = document.querySelectorAll('.about__text');
        if (content.about.bio1 && aboutTexts[0]) aboutTexts[0].textContent = content.about.bio1;
        if (content.about.bio2 && aboutTexts[1]) aboutTexts[1].textContent = content.about.bio2;

        var locationVal = document.querySelector('.about__detail-value');
        if (content.about.location) {
            var details = document.querySelectorAll('.about__detail');
            details.forEach(function (d) {
                var label = d.querySelector('.about__detail-label');
                if (label && label.textContent === 'Location') {
                    var val = d.querySelector('.about__detail-value');
                    if (val) val.textContent = content.about.location;
                }
            });
        }
    }

    // --- Projects ---
    if (content.projects && content.projects.length > 0) {
        var grid = document.querySelector('.projects__grid');
        if (grid) {
            grid.innerHTML = '';
            content.projects.forEach(function (p) {
                var tagsHtml = '';
                if (p.tags && p.tags.length) {
                    tagsHtml = '<div class="project-card__tags">' +
                        p.tags.map(function (t) { return '<span class="project-tag">' + escHtml(t) + '</span>'; }).join('') +
                        '</div>';
                }
                var imageHtml;
                if (p.image) {
                    imageHtml = '<img src="' + escAttr(p.image) + '" alt="' + escAttr(p.title || '') + '" loading="lazy">';
                } else {
                    imageHtml = '<div class="project-card__placeholder"><span class="project-card__icon">' + escHtml(p.icon || '📁') + '</span></div>';
                }
                var card = document.createElement('article');
                card.className = 'project-card reveal visible';
                card.innerHTML =
                    '<div class="project-card__image">' +
                        imageHtml +
                        '<div class="project-card__overlay"><span>View Project</span></div>' +
                    '</div>' +
                    '<div class="project-card__info">' +
                        '<span class="project-card__category">' + escHtml(p.category || '') + '</span>' +
                        '<h3 class="project-card__title">' + escHtml(p.title || '') + '</h3>' +
                        '<p class="project-card__desc">' + escHtml(p.desc || '') + '</p>' +
                        tagsHtml +
                    '</div>';
                grid.appendChild(card);
            });
        }
    }

    // --- Skills ---
    if (content.skills && content.skills.length > 0) {
        var skillsGrid = document.querySelector('.skills__grid');
        if (skillsGrid) {
            skillsGrid.innerHTML = '';
            content.skills.forEach(function (group) {
                var div = document.createElement('div');
                div.className = 'skill-group reveal visible';
                div.innerHTML =
                    '<h3 class="skill-group__title">' + escHtml(group.title || '') + '</h3>' +
                    '<div class="skill-group__tags">' +
                        (group.tags || []).map(function (t) { return '<span class="skill-tag">' + escHtml(t) + '</span>'; }).join('') +
                    '</div>';
                skillsGrid.appendChild(div);
            });
        }
    }

    // --- Education ---
    if (content.education && content.education.length > 0) {
        var timeline = document.querySelector('.timeline');
        if (timeline) {
            timeline.innerHTML = '';
            content.education.forEach(function (entry) {
                var badgeHtml = entry.badge ? '<span class="timeline__badge">' + escHtml(entry.badge) + '</span>' : '';
                var descHtml = entry.desc ? '<p class="timeline__desc">' + escHtml(entry.desc) + '</p>' : '';
                var item = document.createElement('div');
                item.className = 'timeline__item reveal visible';
                item.innerHTML =
                    '<div class="timeline__marker"></div>' +
                    '<div class="timeline__content">' +
                        badgeHtml +
                        '<h3 class="timeline__title">' + escHtml(entry.title || '') + '</h3>' +
                        '<span class="timeline__institution">' + escHtml(entry.institution || '') + '</span>' +
                        '<p class="timeline__detail">' + escHtml(entry.detail || '') + '</p>' +
                        descHtml +
                    '</div>';
                timeline.appendChild(item);
            });
        }
    }

    // --- Certifications ---
    if (content.certifications && content.certifications.length > 0) {
        var certsGrid = document.querySelector('.certs__grid');
        if (certsGrid) {
            certsGrid.innerHTML = '';
            content.certifications.forEach(function (cert) {
                var linkHtml = cert.link ? '<a href="' + escAttr(cert.link) + '" class="cert-card__link" target="_blank" rel="noopener noreferrer">View Certificate →</a>' : '';
                var card = document.createElement('div');
                card.className = 'cert-card reveal visible';
                card.innerHTML =
                    '<div class="cert-card__icon">' + escHtml(cert.icon || '📜') + '</div>' +
                    '<div class="cert-card__info">' +
                        '<h3 class="cert-card__title">' + escHtml(cert.title || '') + '</h3>' +
                        '<p class="cert-card__desc">' + escHtml(cert.desc || '') + '</p>' +
                        linkHtml +
                    '</div>';
                certsGrid.appendChild(card);
            });
        }
    }

    // --- Contact ---
    if (content.contact) {
        if (content.contact.email) {
            var emailBtn = document.querySelector('.contact .btn--primary');
            if (emailBtn) {
                emailBtn.textContent = content.contact.email;
                emailBtn.href = 'mailto:' + content.contact.email;
            }
        }
    }

    // --- Chatbot ---
    if (content.chatbot) {
        if (content.chatbot.greeting) {
            var firstMsg = document.querySelector('.chatbot__msg--bot p');
            if (firstMsg) firstMsg.textContent = content.chatbot.greeting;
        }
    }

    } // end applyContent

    // --- Escape utilities ---
    function escHtml(str) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    function escAttr(str) {
        return escHtml(str).replace(/"/g, '&quot;');
    }
})();
