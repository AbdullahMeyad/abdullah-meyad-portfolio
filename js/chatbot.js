/* ============================================
   CHATBOT.JS — Chat Widget with n8n Webhook
   ============================================ */

(function () {
    'use strict';

    // Read webhook URL fresh each time (picks up admin changes without page reload)
    function getWebhookUrl() {
        try {
            var stored = JSON.parse(localStorage.getItem('portfolio_content'));
            if (stored && stored.chatbot && stored.chatbot.webhookUrl) {
                return stored.chatbot.webhookUrl;
            }
        } catch (e) { /* ignore */ }
        return '';
    }

    // Generate a session ID for conversation memory
    var sessionId = sessionStorage.getItem('chatbot_session');
    if (!sessionId) {
        sessionId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
        sessionStorage.setItem('chatbot_session', sessionId);
    }

    var toggle = document.getElementById('chatbotToggle');
    var window_ = document.getElementById('chatbotWindow');
    var close = document.getElementById('chatbotClose');
    var form = document.getElementById('chatbotForm');
    var input = document.getElementById('chatbotInput');
    var messages = document.getElementById('chatbotMessages');

    if (!toggle) return;

    // Toggle chat window
    toggle.addEventListener('click', function () {
        var isOpen = window_.classList.toggle('active');
        toggle.classList.toggle('active');
        if (isOpen) {
            input.focus();
        }
    });

    close.addEventListener('click', function () {
        window_.classList.remove('active');
        toggle.classList.remove('active');
    });

    // Send message
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var text = input.value.trim();
        if (!text) return;

        appendMessage(text, 'user');
        input.value = '';

        // Show typing indicator
        var typingEl = showTyping();

        var webhookUrl = getWebhookUrl();
        if (webhookUrl) {
            // Send to n8n webhook
            fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, sessionId: sessionId })
            })
            .then(function (res) {
                var contentType = res.headers.get('content-type') || '';
                if (contentType.indexOf('application/json') !== -1) {
                    return res.json();
                }
                // n8n may return plain text
                return res.text().then(function (t) {
                    try { return JSON.parse(t); }
                    catch (e) { return { reply: t }; }
                });
            })
            .then(function (data) {
                removeTyping(typingEl);
                var reply;
                // Handle different n8n response shapes
                if (typeof data === 'string') {
                    reply = data;
                } else if (Array.isArray(data) && data.length > 0) {
                    reply = data[0].output || data[0].reply || data[0].message || data[0].text || JSON.stringify(data[0]);
                } else {
                    reply = data.output || data.reply || data.message || data.text || 'Thanks for your message! I\'ll get back to you soon.';
                }
                appendMessage(reply, 'bot');
            })
            .catch(function (err) {
                console.error('Chatbot error:', err);
                removeTyping(typingEl);
                appendMessage('Sorry, something went wrong. Please try again or email me directly.', 'bot');
            });
        } else {
            // Fallback when no webhook configured
            setTimeout(function () {
                removeTyping(typingEl);
                appendMessage('Thanks for your message! Abdullah will get back to you soon. You can also reach him at abdullahmeyad7@gmail.com', 'bot');
            }, 1000);
        }
    });

    function appendMessage(text, sender) {
        var div = document.createElement('div');
        div.className = 'chatbot__msg chatbot__msg--' + sender;
        var p = document.createElement('p');
        p.textContent = text;
        div.appendChild(p);
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }

    function showTyping() {
        var div = document.createElement('div');
        div.className = 'chatbot__msg chatbot__msg--bot chatbot__typing';
        div.innerHTML = '<div class="chatbot__dots"><span></span><span></span><span></span></div>';
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
        return div;
    }

    function removeTyping(el) {
        if (el && el.parentNode) {
            el.parentNode.removeChild(el);
        }
    }
})();
