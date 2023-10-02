
from io import StringIO
from flask import Flask, request, jsonify
from contextlib import redirect_stdout, redirect_stderr
from flask_cors import CORS
import uuid

app = Flask(__name__)
CORS(app)

sessions = {}  # Almacenar códigos por sesión


@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({'status': "cypherpunks"})

@app.route('/', methods=['GET'])
def get_code():
    session_id = request.args.get('sessionId')
    if session_id in sessions:
        return sessions[session_id]
    else:
        return "Session not found"

@app.route('/create_session', methods=['GET'])
def create_session():
    session_id = str(uuid.uuid4())  # Generar un ID de sesión único
    sessions[session_id] = ""  # Inicializar con código vacío
    return jsonify({'sessionId': session_id})

@app.route('/save', methods=['POST'])
def save_code():
    data = request.json
    session_id = data['sessionId']
    code = data['code']
    if session_id in sessions:
        sessions[session_id] = code
        print("Code saved successfully")
        return "Code saved successfully"
    else:
        print("Session not found")
        return "Session not found"
    


@app.route('/eval', methods=['POST'])
def eval_python_code():
    data = request.json
    code = data['code']

    try:
        # Ejecuta el código Python y captura la salida y los errores
        result = analyze_code(code)    
        return jsonify(result)

    except Exception as e:
        return jsonify({'error': str(e), 'output': None})

# Utilidad para ejecutar código Python y capturar la salida
def analyze_code(code):
    stdout_capture = StringIO()
    stderr_capture = StringIO()

    with redirect_stdout(stdout_capture), redirect_stderr(stderr_capture):
        try:
            exec(code)
            output = stdout_capture.getvalue()
            result = {"output": output, "error": None}
        except Exception as e:
            error_message = str(e)
            stderr_message = stderr_capture.getvalue()
            if stderr_message:
                error_message += "\n" + stderr_message
            result = {"error": error_message, "output": None}

    return result

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=4000, debug=True)
