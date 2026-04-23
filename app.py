from flask import Flask, request, jsonify, render_template, Response, stream_with_context
from flask_cors import CORS
from openai import OpenAI
import os
import json
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# Responses API configuration
MODEL = os.getenv('MODEL', 'gpt-4o-mini')
VECTOR_STORE_ID = os.getenv('VECTOR_STORE_ID', 'vs_690b26b049008191b35e4ac17073a56b')

SYSTEM_INSTRUCTIONS = """You are a knowledgeable and helpful GDPR Course Assistant. \
Your role is to answer questions about the General Data Protection Regulation (GDPR), \
from core principles and key articles to real-world compliance scenarios and best practices. \
Always be clear, accurate, and practical in your responses. \
When referencing specific GDPR articles or recitals, cite them explicitly. \
Use the knowledge base provided to you via file search to ground your answers in the course material."""


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/chat/stream', methods=['POST'])
def chat_stream():
    """
    Stream a response using the OpenAI Responses API.

    Expects JSON body:
        message            (str, required)  – the user's latest message
        previous_response_id (str, optional) – ID of the last response for conversation chaining
    """
    try:
        data = request.json
        message = data.get('message', '').strip()
        previous_response_id = data.get('previous_response_id')  # None for first turn

        if not message:
            return jsonify({'success': False, 'error': 'Missing message'}), 400

        def generate():
            try:
                # Build request kwargs
                kwargs = {
                    'model': MODEL,
                    'instructions': SYSTEM_INSTRUCTIONS,
                    'input': message,
                    'tools': [
                        {
                            'type': 'file_search',
                            'vector_store_ids': [VECTOR_STORE_ID],
                        }
                    ],
                    'store': True,   # Required for previous_response_id chaining
                }

                # Attach conversation history when continuing a thread
                if previous_response_id:
                    kwargs['previous_response_id'] = previous_response_id

                response_id = None

                with client.responses.stream(**kwargs) as stream:
                    for event in stream:
                        event_type = getattr(event, 'type', None)

                        # Capture the response ID from the first response.created event
                        if event_type == 'response.created':
                            response_id = event.response.id

                        # Stream text deltas to the client
                        elif event_type == 'response.output_text.delta':
                            chunk = getattr(event, 'delta', '')
                            if chunk:
                                yield f"data: {json.dumps({'chunk': chunk})}\n\n"

                        # Signal completion and send response_id for next turn
                        elif event_type == 'response.completed':
                            if not response_id:
                                response_id = event.response.id
                            yield f"data: {json.dumps({'response_id': response_id})}\n\n"
                            yield f"data: {json.dumps({'done': True})}\n\n"

            except Exception as e:
                yield f"data: {json.dumps({'error': str(e)})}\n\n"

        return Response(
            stream_with_context(generate()),
            mimetype='text/event-stream',
            headers={
                'Cache-Control': 'no-cache',
                'X-Accel-Buffering': 'no',
            }
        )

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('DEBUG', 'False').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)
