/* ============================================
   MAIN.JS — Portfolio Interactions
   ============================================ */

(function () {
    'use strict';

    // ---- Cursor Glow ----
    const cursorGlow = document.getElementById('cursorGlow');

    if (window.matchMedia('(pointer: fine)').matches && cursorGlow) {
        document.addEventListener('mousemove', function (e) {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';

            if (!cursorGlow.classList.contains('active')) {
                cursorGlow.classList.add('active');
            }
        });

        document.addEventListener('mouseleave', function () {
            cursorGlow.classList.remove('active');
        });
    }

    // ---- Navigation Scroll State ----
    const nav = document.getElementById('nav');
    let lastScroll = 0;

    function handleNavScroll() {
        var scrollY = window.scrollY;
        if (scrollY > 50) {
            nav.classList.add('nav--scrolled');
        } else {
            nav.classList.remove('nav--scrolled');
        }
        lastScroll = scrollY;
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });

    // ---- Mobile Menu ----
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close on link click
        var mobileLinks = mobileMenu.querySelectorAll('.mobile-menu__link');
        mobileLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ---- Scroll Reveal (IntersectionObserver) ----
    var revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        var revealObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.15,
                rootMargin: '0px 0px -60px 0px',
            }
        );

        revealElements.forEach(function (el) {
            revealObserver.observe(el);
        });
    } else {
        // Fallback: show everything
        revealElements.forEach(function (el) {
            el.classList.add('visible');
        });
    }

    // ---- Smooth Scroll for Anchor Links ----
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                var offset = nav.offsetHeight;
                var top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    // ---- Parallax-like Hero Elements ----
    var heroTitle = document.querySelector('.hero__title');
    var heroTagline = document.querySelector('.hero__tagline');

    if (heroTitle && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
        window.addEventListener(
            'scroll',
            function () {
                var scrollY = window.scrollY;
                var rate = scrollY * 0.3;
                var opacity = Math.max(1 - scrollY / 600, 0);

                heroTitle.style.transform = 'translateY(' + rate + 'px)';
                heroTitle.style.opacity = opacity;

                if (heroTagline) {
                    heroTagline.style.transform = 'translateY(' + rate * 0.5 + 'px)';
                    heroTagline.style.opacity = opacity;
                }
            },
            { passive: true }
        );
    }

    // ---- Active Nav Link Highlight ----
    var sections = document.querySelectorAll('section[id]');

    function highlightNav() {
        var scrollPos = window.scrollY + nav.offsetHeight + 100;

        sections.forEach(function (section) {
            var top = section.offsetTop;
            var height = section.offsetHeight;
            var id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                document.querySelectorAll('.nav__link').forEach(function (link) {
                    link.style.color = '';
                });

                var activeLink = document.querySelector('.nav__link[href="#' + id + '"]');
                if (activeLink && !activeLink.classList.contains('nav__link--cta')) {
                    activeLink.style.color = 'var(--text)';
                }
            }
        });
    }

    window.addEventListener('scroll', highlightNav, { passive: true });

    // ---- Skill Tags Stagger ----
    var skillGroups = document.querySelectorAll('.skill-group');

    if ('IntersectionObserver' in window) {
        var skillObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        var tags = entry.target.querySelectorAll('.skill-tag');
                        tags.forEach(function (tag, i) {
                            tag.style.transition = 'opacity 0.4s ease ' + i * 0.05 + 's, transform 0.4s ease ' + i * 0.05 + 's';
                            tag.style.opacity = '0';
                            tag.style.transform = 'translateY(10px)';

                            requestAnimationFrame(function () {
                                tag.style.opacity = '1';
                                tag.style.transform = 'translateY(0)';
                            });
                        });
                        skillObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );

        skillGroups.forEach(function (group) {
            skillObserver.observe(group);
        });
    }

    // ---- Contact Form ----
    var _cfWebhookUrl = '';

    // Pre-load contact form webhook from config.json
    fetch('config.json')
        .then(function (res) { return res.json(); })
        .then(function (cfg) {
            if (cfg && cfg.contactForm && cfg.contactForm.webhookUrl) {
                _cfWebhookUrl = cfg.contactForm.webhookUrl;
            }
        })
        .catch(function () { /* ignore */ });

    function getContactFormWebhookUrl() {
        try {
            var stored = JSON.parse(localStorage.getItem('portfolio_content'));
            if (stored && stored.contactForm && stored.contactForm.webhookUrl) {
                return stored.contactForm.webhookUrl;
            }
        } catch (e) { /* ignore */ }
        return _cfWebhookUrl;
    }

    var contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var btnText = contactForm.querySelector('.contact-form__btn-text');
            var btnLoading = contactForm.querySelector('.contact-form__btn-loading');
            var status = document.getElementById('cfStatus');
            var submitBtn = contactForm.querySelector('.contact-form__submit');

            var name = document.getElementById('cfName').value.trim();
            var email = document.getElementById('cfEmail').value.trim();
            var subject = document.getElementById('cfSubject').value.trim();
            var message = document.getElementById('cfMessage').value.trim();

            if (!name || !email || !subject || !message) return;

            var webhookUrl = getContactFormWebhookUrl();

            if (!webhookUrl) {
                status.textContent = 'Contact form is not configured yet.';
                status.className = 'contact-form__status contact-form__status--error';
                return;
            }

            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';
            submitBtn.disabled = true;
            status.textContent = '';
            status.className = 'contact-form__status';

            fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name, email: email, subject: subject, message: message })
            })
            .then(function (res) {
                if (!res.ok) throw new Error('Failed');
                return res.text();
            })
            .then(function () {
                status.textContent = 'Message sent successfully! I\'ll get back to you soon.';
                status.className = 'contact-form__status contact-form__status--success';
                contactForm.reset();
            })
            .catch(function () {
                status.textContent = 'Something went wrong. Please try again or email me directly.';
                status.className = 'contact-form__status contact-form__status--error';
            })
            .finally(function () {
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
                submitBtn.disabled = false;
            });
        });
    }
})();
