// ==========================================
// CHATBOT CONFIGURATION
// Update these settings to customize your chatbot
// ==========================================

const CHATBOT_CONFIG = {
    // ==========================================
    // BRANDING & COLORS
    // ==========================================
    branding: {
        // Primary brand color (buttons, accents)
        primaryColor: '#000000',
        primaryHover: '#1a1a1a',
        
        // Background colors
        bgPrimary: '#ffffff',
        bgSecondary: '#f9f9f9',
        bgTertiary: '#f0f0f0',
        
        // Text colors
        textPrimary: '#000000',
        textSecondary: '#333333',
        textMuted: '#666666',
        
        // Message colors
        userMessageBg: '#000000',
        userMessageText: '#ffffff',
        assistantMessageBg: '#f5f5f5',
        assistantMessageText: '#000000',
        
        // Border colors
        borderColor: '#e0e0e0',
        borderHover: '#c0c0c0',
        
        // Accent colors
        accentColor: '#1a1a1a',
        successColor: '#000000',
        errorColor: '#000000',
        warningColor: '#333333',
    },

    // ==========================================
    // TEXT CONTENT
    // ==========================================
    content: {
        // Header
        botName: 'GDPR Course Assistant',
        botSubtitle: 'Always here to help',
        newChatButtonText: 'New Chat',
        
        // Welcome screen
        welcomeTitle: 'Welcome to the GDPR Course Assistant',
        welcomeMessage: 'Ask me anything about GDPR, from core principles to real-world applications.',
        
        // Input placeholder
        inputPlaceholder: 'Type your message here...',
        
        // Status messages
        typingIndicatorText: 'AI is typing...',
        errorMessagePrefix: 'Error: ',
        connectionErrorMessage: 'Connection error. Please check your internet connection.',
        initErrorMessage: 'Failed to initialize chat. Please refresh the page.',
    },

    // ==========================================
    // SVG ICONS & LOGOS
    // ==========================================
    icons: {
        // Voice input icons
        microphoneIcon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
        </svg>`,
        
        microphoneActiveIcon: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
        </svg>`,
        
        // Bot avatar icon (SVG path)
        botAvatar: `<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
        </svg>`,
        
        // User avatar icon (SVG path)
        userAvatar: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>`,
        
        // Assistant message icon (SVG path)
        assistantAvatar: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
        </svg>`,
        
        // New chat button icon
        newChatIcon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>`,
        
        // Send button icon
        sendIcon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
        </svg>`,
        
        // Welcome screen icon
        welcomeIcon: `<svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
        </svg>`,
        
        // Error icon
        errorIcon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>`,
    },

    // ==========================================
    // UI SETTINGS
    // ==========================================
    ui: {
        // Animation settings
        enableAnimations: true,
        messageAnimationDuration: '0.3s',
        
        // Chat container
        maxWidth: '1200px',
        borderRadius: '1rem',
        
        // Message bubbles
        messageBorderRadius: '0.75rem',
        messageMaxWidth: '75%',
        
    // Avatar settings
    avatarSize: '36px',
    headerAvatarSize: '48px',
    showUserAvatar: false,           // Show/hide user message avatar
    showAssistantAvatar: false,      // Show/hide assistant message avatar
    
    // Spacing
    messageGap: '1.5rem',
        
        // Input settings
        inputMaxHeight: '120px',
        
        // Shadows
        enableShadows: true,
        shadowIntensity: 'medium', // 'light', 'medium', 'heavy'
        
    // Show/hide features
    showNewChatButton: true,
    showTimestamps: false,
    showAvatars: true,
    
    // Voice Input
    enableVoiceInput: true,         // Enable/disable voice input button
    voiceLanguage: 'en-US',         // Voice recognition language (en-US, es-ES, fr-FR, etc.)
    voiceContinuous: false,         // Continuous listening (true) or single phrase (false)
    
    // Typing indicator
    showTypingIndicator: true,
    typingIndicatorDelay: 500, // ms
    },

    // ==========================================
    // ADVANCED SETTINGS
    // ==========================================
    advanced: {
        // Auto-scroll behavior
        autoScroll: true,
        smoothScroll: true,
        
        // Message formatting
        enableMarkdown: true,
        enableCodeFormatting: true,
        
        // Input behavior
        sendOnEnter: true, // true = Enter sends, Shift+Enter = new line
        autoResizeInput: true,
        
        // Performance
        messageLimit: 100, // Max messages to keep in DOM
        
        // Accessibility
        enableKeyboardShortcuts: true,
    }
};

// Apply CSS variables from config
function applyConfigStyles() {
    const root = document.documentElement;
    const { branding } = CHATBOT_CONFIG;
    
    // Apply color variables
    root.style.setProperty('--primary-color', branding.primaryColor);
    root.style.setProperty('--primary-hover', branding.primaryHover);
    root.style.setProperty('--bg-primary', branding.bgPrimary);
    root.style.setProperty('--bg-secondary', branding.bgSecondary);
    root.style.setProperty('--bg-tertiary', branding.bgTertiary);
    root.style.setProperty('--text-primary', branding.textPrimary);
    root.style.setProperty('--text-secondary', branding.textSecondary);
    root.style.setProperty('--text-muted', branding.textMuted);
    root.style.setProperty('--user-message-bg', branding.userMessageBg);
    root.style.setProperty('--user-message-text', branding.userMessageText);
    root.style.setProperty('--assistant-message-bg', branding.assistantMessageBg);
    root.style.setProperty('--assistant-message-text', branding.assistantMessageText);
    root.style.setProperty('--border-color', branding.borderColor);
    root.style.setProperty('--border-hover', branding.borderHover);
    root.style.setProperty('--accent-color', branding.accentColor);
    root.style.setProperty('--success-color', branding.successColor);
    root.style.setProperty('--error-color', branding.errorColor);
    root.style.setProperty('--warning-color', branding.warningColor);
}

// Export config
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CHATBOT_CONFIG;
}

