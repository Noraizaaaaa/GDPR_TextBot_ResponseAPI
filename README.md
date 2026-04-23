# GDPR TextBot

An intelligent AI-powered chatbot that provides real-time assistance with GDPR-related questions through a modern web interface. Built with the **OpenAI Responses API**, featuring streaming responses, Vector Store integration for RAG, voice input capabilities, and fully customizable branding.

**Developed for [Inselo.co.uk](https://inselo.co.uk)**
*Last Updated: April 23, 2026*

![Python](https://img.shields.io/badge/Python-3.11-blue)
![Flask](https://img.shields.io/badge/Flask-3.0-green)
![OpenAI](https://img.shields.io/badge/OpenAI-Responses_API-orange)
![Status](https://img.shields.io/badge/Status-Private-red)

## Features

- **OpenAI Responses API** - Uses stateful multi-turn conversations via `previous_response_id` chaining
- **File Search Integration** - Uses OpenAI Vector Stores to ground answers in GDPR course material
- **Real-time Streaming** - Server-Sent Events (SSE) for live response streaming with zero polling
- **Voice Input** - Optional Web Speech API integration for voice commands
- **Stateful Conversations** - Each session maintains context automatically through the API
- **Fully Customizable** - Complete white-label configuration via `config.js`
- **Markdown Formatting** - Rich text with bold, lists, code blocks, and headers
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Performance Optimized** - Fast context-aware responses with direct SSE streaming

## Quick Start

### Prerequisites

- Python 3.11 or higher
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- OpenAI Vector Store ID with your GDPR files ([Create one here](https://platform.openai.com/storage))
- Modern web browser with microphone support (for voice input)

### Installation

1. **Navigate to the project directory**
   ```bash
   cd GDPR_TextBot/1.0
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**

   **Option A: .env File** (Recommended)
   
   Create a `.env` file in the project root:
   ```env
   OPENAI_API_KEY=your-api-key-here
   VECTOR_STORE_ID=your-vector-store-id-here
   MODEL=gpt-4o-mini
   DEBUG=False
   ```

   **Option B: Environment Variables**
   
   Windows (PowerShell):
   ```powershell
   $env:OPENAI_API_KEY="your-api-key-here"
   $env:VECTOR_STORE_ID="your-vector-store-id-here"
   ```
   
   Unix/Linux/Mac:
   ```bash
   export OPENAI_API_KEY='your-api-key-here'
   export VECTOR_STORE_ID='your-vector-store-id-here'
   ```

4. **Run the application**
   ```bash
   python app.py
   ```

5. **Open your browser**
   
   Navigate to: `http://localhost:5000`

6. **Start using!**
   - Type your GDPR questions in the chat interface
   - Or enable voice input and speak your questions
   - View streaming responses in real-time
   - Start new conversations with the "New Chat" button

## Project Structure

```
GDPR_TextBot/1.0/
├── app.py                 # Flask backend server mapping Responses API
├── requirements.txt       # Python dependencies (requires openai>=1.66.0)
├── runtime.txt            # Python version specification
├── Procfile               # Deployment configuration
├── README.md              # This file
├── templates/
│   └── index.html         # Main HTML template
└── static/
    ├── config.js          # Frontend configuration (branding & behavior)
    ├── script.js          # Frontend JavaScript utilizing SSE mapping response ids
    └── styles.css         # Custom CSS styling
```

## Configuration

### Frontend Configuration (`static/config.js`)

All branding and UI settings are centralized in one place. Customize without touching core code:

```javascript
CHATBOT_CONFIG.branding = {
    primaryColor: '#2563eb',
    // ... more color options
}

CHATBOT_CONFIG.content = {
    botName: 'GDPR Assistant',
    botSubtitle: 'Inselo Compliance Support',
    newChatButtonText: 'New Chat',
    // ... more text options
}
```

### Backend Configuration (`app.py`)

**Change System Prompt / Instructions:**
To adjust how the bot behaves or what persona it adopts, modify `SYSTEM_INSTRUCTIONS` directly inside `app.py`:

```python
SYSTEM_INSTRUCTIONS = """You are a knowledgeable and helpful GDPR Course Assistant..."""
```

## API Endpoints

### `POST /api/chat/stream`
Sends a message and streams the response natively using the OpenAI Responses API. Maintains conversational history automatically when `previous_response_id` is provided. The vector store is automatically searched if relevant.
- **Input**: `{ message: string, previous_response_id: string|null }`
- **Output**: Server-Sent Events (SSE) emitting chunks of text `{"chunk": "..."}`, followed by `{"response_id": "resp_..."}`, and finally `{"done": true}`.

## Usage Guide

### Text Interaction
1. Type your GDPR question in the input field
2. Press Enter or click the send button
3. View the streaming response in real-time
4. Continue the conversation or start a new chat

### Voice Interaction (if enabled)
1. Click the microphone icon to start voice input
2. Speak your GDPR-related question clearly
3. Click again to stop and send
4. View the transcribed text and AI response

## Deployment

### Deploy to Render (Recommended)

1. Create a `Procfile` if you don't have one:
   ```
   web: gunicorn app:app
   ```
2. In Render, create a New Web Service connected to your repository.
3. Set environment variables:
   - `OPENAI_API_KEY`
   - `VECTOR_STORE_ID`
   - `MODEL` (optional, defaults to `gpt-4o-mini`)

Repeat a similar approach for Railway, Heroku, DigitalOcean App Platform, or a VPS with systemd and Nginx.

## API Costs

This application uses OpenAI's paid APIs. Typical costs:

| Service | Cost | Usage |
|---------|------|-------|
| **Responses API (GPT-4o-mini)** | ~$0.15/1M input tokens<br>~$0.60/1M output tokens | Chat responses |
| **Vector Store Storage** | ~$0.10/GB/day (first 1GB free) | File searching |

**Estimated cost per conversation**: < $0.01

Monitor your usage at: https://platform.openai.com/usage

## Troubleshooting

### API Errors
- **Invalid API key**: Verify `OPENAI_API_KEY` is set correctly
- **Invalid Vector Store ID**: Check `VECTOR_STORE_ID` matches your file search store
- **Older OpenAI SDK**: Ensure `openai>=1.66.0` is installed (as `client.responses.create` requires recent versions).

### Streaming Issues
- **Partial responses**: Verify Server-Sent Events (SSE) aren't blocked by your firewall/proxy.
- **No context in multi-turn**: Ensure `script.js` properly receives and forwards the `response_id` as `previous_response_id` across turns.

## Security Best Practices

- **Never commit API keys** to version control
- **Use HTTPS** in production (required for voice input)
- **Regularly rotate API keys** (monthly or quarterly)
- **Add rate limiting** to prevent abuse

## License & Ownership

**© 2026 Inselo.co.uk - All Rights Reserved**

This is a private, proprietary project developed exclusively for Inselo.co.uk. 

**Restrictions:**
- No public distribution
- No commercial use by third parties
- No modification without permission
- No open-source license

**For internal use only.** Unauthorized copying, distribution, or use of this software is strictly prohibited.
