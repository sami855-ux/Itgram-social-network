from flask import Flask, request, jsonify
from flask_cors import CORS
from googletrans import Translator, LANGUAGES
import time
import random
from functools import wraps

app = Flask(__name__)

# Enable CORS with specific configuration
CORS(app, resources={
    r"/translate": {
        "origins": ["https://itgram-social-network-w6pm.vercel.app"],
        "methods": ["POST"],
        "allow_headers": ["Content-Type"]
    }
})

# User-Agent rotation pool (expanded)
USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 16_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Linux; Android 12; SM-S906N Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/80.0.3987.119 Mobile Safari/537.36',
    'Mozilla/5.0 (iPad; CPU OS 16_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Mobile/15E148 Safari/604.1'
]

# Service URL rotation (expanded)
SERVICE_URLS = [
    'translate.google.com',
    'translate.google.co.kr',
    'translate.google.de',
    'translate.google.fr',
    'translate.google.es',
    'translate.google.it',
    'translate.google.ru',
    'translate.google.com.br'
]

def get_translator():
    return Translator(
        service_urls=random.sample(SERVICE_URLS, 3),  # Randomly pick 3 endpoints
        user_agent=random.choice(USER_AGENTS)
    )

# Enhanced rate limiting (300 requests/minute)
def rate_limit(max_calls=300, time_frame=60):
    calls = {}
    
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            now = time.time()
            client_ip = request.remote_addr
            
            if client_ip not in calls:
                calls[client_ip] = []
            
            # Remove calls outside current time window
            calls[client_ip] = [t for t in calls[client_ip] if t > now - time_frame]
            
            if len(calls[client_ip]) >= max_calls:
                return jsonify({
                    "error": "Rate limit exceeded",
                    "retry_after_seconds": time_frame,
                    "limit": max_calls,
                    "window": f"{time_frame} seconds",
                    "tips": "Distribute requests evenly across the minute"
                }), 429
                
            calls[client_ip].append(now)
            return f(*args, **kwargs)
        return wrapper
    return decorator

@app.route('/translate', methods=['POST', 'OPTIONS'])
@rate_limit(max_calls=300)  # 300 RPM limit
def translate():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['text', 'src', 'dest']
    if not all(field in data for field in required_fields):
        return _cors_response(jsonify({
            "error": "Missing parameters",
            "required": required_fields,
            "received": list(data.keys()) if data else None
        }), 400)

    text = data['text'].strip()
    src = data['src'].lower()
    dest = data['dest'].lower()

    # Validate language codes
    if src not in LANGUAGES or dest not in LANGUAGES:
        return _cors_response(jsonify({
            "error": "Invalid language code",
            "supported_languages": LANGUAGES,
            "received": {"src": src, "dest": dest}
        }), 400)

    # Validate text
    if not text:
        return _cors_response(jsonify({
            "error": "Empty text",
            "message": "Text cannot be blank"
        }), 400)

    # Translation with enhanced retries
    max_retries = 5  # Increased from 3
    for attempt in range(max_retries):
        try:
            translator = get_translator()
            translated = translator.translate(text, src=src, dest=dest)
            
            return _cors_response(jsonify({
                "original_text": text,
                "translated_text": translated.text,
                "source_language": translated.src,
                "destination_language": dest,
                "confidence": translated.extra_data.get('confidence', None),
                "status": "success",
                "attempt": attempt + 1,
                "service_used": translator.service_urls[0]  # Show which endpoint was used
            }))
            
        except Exception as e:
            if attempt == max_retries - 1:
                return _cors_response(jsonify({
                    "error": "Translation failed after all retries",
                    "message": str(e),
                    "retry_attempts": max_retries,
                    "status": "failed",
                    "suggestion": "Try again later or with different text"
                }), 503)
            
            # Smart backoff with increasing jitter
            base_delay = min(1 * (attempt + 1), 5)
            sleep_time = base_delay + random.random()
            time.sleep(sleep_time)

def _build_cors_preflight_response():
    response = jsonify({"message": "Preflight accepted"})
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")
    response.headers.add("Access-Control-Allow-Methods", "POST")
    return response

def _cors_response(response, status_code=200):
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
    return response, status_code

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True, threaded=True)