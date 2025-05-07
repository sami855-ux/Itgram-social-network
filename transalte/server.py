from flask import Flask, request, jsonify
from googletrans import Translator
import time
from functools import wraps

app = Flask(__name__)

# Configure translator with rotating service URLs
SERVICE_URLS = [
    'translate.google.com',
    'translate.google.co.kr',
    'translate.google.de',
    'translate.google.fr'
]

translator = Translator(service_urls=SERVICE_URLS)

# Rate limiting (10 requests/minute)
def rate_limit(max_calls=10, time_frame=60):
    calls = []
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            now = time.time()
            calls_in_time = [call for call in calls if call > now - time_frame]
            if len(calls_in_time) >= max_calls:
                return jsonify({
                    "error": "Rate limit exceeded",
                    "retry_after": f"{time_frame} seconds"
                }), 429
            calls.append(now)
            return f(*args, **kwargs)
        return wrapper
    return decorator

@app.route('/translate', methods=['POST'])
@rate_limit()
def translate():
    data = request.get_json()
    
    # Input validation
    if not data or 'text' not in data or not isinstance(data['text'], str):
        return jsonify({
            "error": "Invalid request",
            "message": "Missing or invalid 'text' parameter"
        }), 400
    
    text = data['text'].strip()
    if not text:
        return jsonify({
            "error": "Empty text",
            "message": "Text cannot be empty"
        }), 400

    max_retries = 3
    retry_delay = 2  # seconds
    
    for attempt in range(max_retries):
        try:
            # Removed timeout parameter
            translated = translator.translate(text, src='en', dest='am')
            
            if not translated.text:
                raise ValueError("Empty translation response")
                
            return jsonify({

                "original_text": text,
                "translated_text": translated.text,
                "language": translated.src,
                "confidence": translated.extra_data.get('confidence', None),
                "success": True,
            })
            
        except Exception as e:
            if attempt == max_retries - 1:
                return jsonify({
                    "error": "Translation failed",
                    "message": str(e),
                    "service_status": "unavailable",
                    "retry_suggestion": "Try again later or use a VPN"
                }), 503
                
            time.sleep(retry_delay * (attempt + 1))  # Exponential backoff

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)