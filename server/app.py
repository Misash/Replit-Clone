from flask import Flask, render_template, request, jsonify, send_file
from contextlib import redirect_stdout, redirect_stderr
from flask_cors import CORS  # Importa Flask-CORS
from io import StringIO

app = Flask(__name__)
CORS(app)  # Inicializa Flask-CORS con tu aplicación Flask


# utils
def analyze_code(code):
    # Capture standard output and error
    stdout_capture = StringIO()
    stderr_capture = StringIO()

    with redirect_stdout(stdout_capture), redirect_stderr(stderr_capture):
        try:
            # Execute the Python code
            exec(code)

            # If there are no errors, return the output
            output = stdout_capture.getvalue()
            result = {"output": output, "error": None}

        except Exception as e:
            # If there is an error, return the error message
            error_message = str(e)
            stderr_message = stderr_capture.getvalue()
            if stderr_message:
                error_message += "\n" + stderr_message
            result = {"error": error_message, "output": None}

    return result



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

if __name__ == '__main__':
    app.run(port=4000, debug=True)
