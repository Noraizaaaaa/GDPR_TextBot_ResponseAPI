// ==========================================
// STATE MANAGEMENT
// ==========================================
let previousResponseId = null;  // Chains Responses API turns (replaces thread_id)
let isProcessing = false;

// ==========================================
// DOM ELEMENTS
// ==========================================
const messagesContainer = document.getElementById('messagesContainer');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const voiceBtn = document.getElementById('voiceBtn');
const newChatBtn = document.getElementById('newChatBtn');
const typingIndicator = document.getElementById('typingIndicator');

// Voice recognition
let recognition = null;
let isListening = false;
let previousText = ''; // Store text before voice input starts

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    applyConfig();
    initializeChat();
    setupEventListeners();
});

// ==========================================
// APPLY CONFIGURATION
// ==========================================
function applyConfig() {
    // Apply CSS variables from config
    applyConfigStyles();

    // Update text content
    const { content, icons, ui } = CHATBOT_CONFIG;

    // Update header
    document.querySelector('.chat-title').textContent = content.botName;
    document.querySelector('.chat-subtitle').textContent = content.botSubtitle;
    document.querySelector('#newChatBtn').innerHTML = icons.newChatIcon + '<span>' + content.newChatButtonText + '</span>';

    // Update header avatar
    document.querySelector('.bot-avatar').innerHTML = icons.botAvatar;

    // Update welcome message
    document.querySelector('.welcome-title').textContent = content.welcomeTitle;
    document.querySelector('.welcome-text').textContent = content.welcomeMessage;
    document.querySelector('.welcome-icon').innerHTML = icons.welcomeIcon;

    // Update input placeholder
    messageInput.placeholder = content.inputPlaceholder;

    // Update send button icon
    sendBtn.innerHTML = icons.sendIcon;

    // Setup voice input if enabled
    if (ui.enableVoiceInput) {
        setupVoiceInput();
        voiceBtn.style.display = 'flex';
        voiceBtn.innerHTML = icons.microphoneIcon;
    }
}

async function initializeChat() {
    // Responses API is stateless on the client — no thread creation needed.
    // Conversation history is chained via previousResponseId returned by each response.
    previousResponseId = null;
    console.log('Chat initialized (Responses API — stateless init)');
}

// ==========================================
// EVENT LISTENERS
// ==========================================
function setupEventListeners() {
    // Send message on button click
    sendBtn.addEventListener('click', handleSendMessage);

    // Send message on Enter key (Shift+Enter for new line)
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });

    // Auto-resize textarea
    messageInput.addEventListener('input', () => {
        messageInput.style.height = 'auto';
        messageInput.style.height = messageInput.scrollHeight + 'px';

        // Enable/disable send button based on input
        sendBtn.disabled = messageInput.value.trim() === '';
    });

    // New chat button
    newChatBtn.addEventListener('click', handleNewChat);
}

// ==========================================
// MESSAGE HANDLING
// ==========================================
async function handleSendMessage() {
    const message = messageInput.value.trim();

    if (!message || isProcessing) {
        return;
    }

    isProcessing = true;
    sendBtn.disabled = true;

    // Clear welcome message if exists
    const welcomeMessage = document.querySelector('.welcome-message');
    if (welcomeMessage) {
        welcomeMessage.remove();
    }

    // Add user message to UI
    addMessage(message, 'user');

    // Clear input
    messageInput.value = '';
    messageInput.style.height = 'auto';

    try {
        // Create a placeholder for the streaming response (with blinking cursor)
        const assistantMessageDiv = createStreamingMessage();
        let fullResponse = '';

        const response = await fetch('/api/chat/stream', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                previous_response_id: previousResponseId,  // null on first turn
                message: message
            })
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();

            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const data = JSON.parse(line.slice(6));

                        if (data.chunk) {
                            // Append chunk to response
                            fullResponse += data.chunk;
                            updateStreamingMessage(assistantMessageDiv, fullResponse);
                        } else if (data.response_id) {
                            // Save response ID for next turn conversation chaining
                            previousResponseId = data.response_id;
                            console.log('Response ID saved:', previousResponseId);
                        } else if (data.done) {
                            // Streaming complete
                            console.log('Streaming complete');
                        } else if (data.error) {
                            showError('Error: ' + data.error);
                        }
                    } catch (e) {
                        // Ignore parse errors for incomplete chunks
                    }
                }
            }
        }

        // Finalize the message
        if (fullResponse) {
            finalizeStreamingMessage(assistantMessageDiv, fullResponse);
        }

    } catch (error) {
        console.error('Error sending message:', error);
        showError('Failed to send message. Please try again.');
    } finally {
        isProcessing = false;
        sendBtn.disabled = messageInput.value.trim() === '';
    }
}

// ==========================================
// UI FUNCTIONS
// ==========================================
function addMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;

    // Check if avatar should be shown based on config
    const showAvatar = type === 'user'
        ? CHATBOT_CONFIG.ui.showUserAvatar
        : CHATBOT_CONFIG.ui.showAssistantAvatar;

    if (showAvatar) {
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';

        // Use icons from config
        if (type === 'user') {
            avatar.innerHTML = CHATBOT_CONFIG.icons.userAvatar;
        } else {
            avatar.innerHTML = CHATBOT_CONFIG.icons.assistantAvatar;
        }

        messageDiv.appendChild(avatar);
    } else {
        // Add class to indicate no avatar
        messageDiv.classList.add('no-avatar');
    }

    const content = document.createElement('div');
    content.className = 'message-content';
    content.innerHTML = formatMessage(text);

    messageDiv.appendChild(content);

    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

// ==========================================
// STREAMING MESSAGE FUNCTIONS
// ==========================================
function createStreamingMessage() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message assistant-message';

    // Check if avatar should be shown
    if (CHATBOT_CONFIG.ui.showAssistantAvatar) {
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = CHATBOT_CONFIG.icons.assistantAvatar;
        messageDiv.appendChild(avatar);
    } else {
        messageDiv.classList.add('no-avatar');
    }

    const content = document.createElement('div');
    content.className = 'message-content';
    content.innerHTML = '<span class="cursor-blink">▋</span>';

    messageDiv.appendChild(content);
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();

    return messageDiv;
}

function updateStreamingMessage(messageDiv, text) {
    const content = messageDiv.querySelector('.message-content');
    // Append a unique placeholder to the text before formatting, so the cursor 
    // stays inline with the current paragraph or list item during runtime render.
    let html = formatMessage(text + ' ▋CURSOR▋');
    html = html.replace('▋CURSOR▋', '<span class="cursor-blink">▋</span>');
    
    content.innerHTML = html;
    scrollToBottom();
}

function finalizeStreamingMessage(messageDiv, text) {
    const content = messageDiv.querySelector('.message-content');
    content.innerHTML = formatMessage(text);
    scrollToBottom();
}

// Format message text with markdown-like formatting using marked.js
function formatMessage(text) {
    // Remove OpenAI citations like 【4:6†source】
    text = text.replace(/【.*?】/g, '');

    if (typeof marked !== 'undefined') {
        let html = marked.parse(text, {
            breaks: true,
            gfm: true
        });
        
        // Clean up any empty paragraphs that marked might generate
        html = html.replace(/<p>\s*<\/p>/g, '');
        return html;
    } else {
        // Fallback basic parser in case marked.js fails to load
        let formatted = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        
        formatted = formatted.replace(/\n\n+/g, '</p><p>');
        formatted = formatted.replace(/\n/g, '<br>');
        return '<p>' + formatted + '</p>';
    }
}

function hideTypingIndicator() {
    typingIndicator.classList.add('hidden');
}

function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showError(message) {
    // Create temporary error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'message assistant-message';
    errorDiv.innerHTML = `
        <div class="message-avatar">
            ${CHATBOT_CONFIG.icons.errorIcon}
        </div>
        <div class="message-content" style="background-color: var(--error-color); color: white; border: none;">
            ${message}
        </div>
    `;

    messagesContainer.appendChild(errorDiv);
    scrollToBottom();
}

// ==========================================
// NEW CHAT HANDLING
// ==========================================
async function handleNewChat() {
    if (isProcessing) {
        return;
    }

    const { content, icons } = CHATBOT_CONFIG;

    // Clear messages
    messagesContainer.innerHTML = `
        <div class="welcome-message">
            <div class="welcome-icon">
                ${icons.welcomeIcon}
            </div>
            <h2 class="welcome-title">${content.welcomeTitle}</h2>
            <p class="welcome-text">${content.welcomeMessage}</p>
        </div>
    `;

    // Reset conversation — next message starts a fresh Responses API chain
    await initializeChat();

    // Reset input
    messageInput.value = '';
    messageInput.style.height = 'auto';
    sendBtn.disabled = true;
}

// ==========================================
// VOICE INPUT FUNCTIONS
// ==========================================
function setupVoiceInput() {
    // Check if voice button exists
    if (!voiceBtn) {
        console.warn('Voice button element not found');
        return;
    }

    // Check if browser supports Web Speech API
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.warn('Web Speech API not supported in this browser');
        voiceBtn.style.display = 'none';
        return;
    }

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();

    // Configure recognition
    recognition.lang = CHATBOT_CONFIG.ui.voiceLanguage || 'en-US';
    recognition.continuous = CHATBOT_CONFIG.ui.voiceContinuous || false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    // Handle results
    recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }

        // Append to previous text instead of replacing
        const fullText = previousText + (previousText ? ' ' : '') + transcript;
        messageInput.value = fullText;
        messageInput.style.height = 'auto';
        messageInput.style.height = messageInput.scrollHeight + 'px';

        // Enable send button if there's text
        sendBtn.disabled = fullText.trim() === '';
    };

    // Handle errors
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        stopVoiceInput();

        if (event.error === 'not-allowed') {
            showError('Microphone access denied. Please allow microphone access in your browser settings.');
        } else if (event.error === 'no-speech') {
            // Silent error, just stop
        } else {
            showError('Voice input error: ' + event.error);
        }
    };

    // Handle end
    recognition.onend = () => {
        stopVoiceInput();
    };

    // Add click event to voice button
    if (voiceBtn) {
        voiceBtn.addEventListener('click', toggleVoiceInput);
    }
}

function toggleVoiceInput() {
    if (isListening) {
        stopVoiceInput();
    } else {
        startVoiceInput();
    }
}

function startVoiceInput() {
    if (!recognition || isProcessing || !voiceBtn) return;

    try {
        // Save existing text before starting voice input
        previousText = messageInput.value.trim();

        recognition.start();
        isListening = true;
        voiceBtn.classList.add('recording');
        voiceBtn.innerHTML = CHATBOT_CONFIG.icons.microphoneActiveIcon;
        voiceBtn.title = 'Stop recording';

        // Add visual feedback
        voiceBtn.style.animation = 'pulse 1.5s infinite';
    } catch (error) {
        console.error('Error starting voice input:', error);
        stopVoiceInput();
    }
}

function stopVoiceInput() {
    if (!recognition) return;

    try {
        recognition.stop();
    } catch (error) {
        // Already stopped
    }

    isListening = false;

    // Clear previous text reference after stopping
    // (Will be set again on next start)

    if (voiceBtn) {
        voiceBtn.classList.remove('recording');
        voiceBtn.innerHTML = CHATBOT_CONFIG.icons.microphoneIcon;
        voiceBtn.title = 'Voice input';
        voiceBtn.style.animation = '';
    }
}

