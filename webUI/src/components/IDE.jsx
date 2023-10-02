
import { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap';
import AceEditor from 'react-ace';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-tomorrow';
import 'ace-builds/src-noconflict/ext-language_tools';
import axios from 'axios';
import '../style/IDE.css';
import { useLocation } from 'react-router-dom';
import {API_URL} from "../../config.js"

export default function PythonCodeAnalyzer() {
    const [code, setCode] = useState('');
    const [fileName, setFileName] = useState('main.py');
    const [result, setResult] = useState(null);
    const [sessionId, setSessionId] = useState('');
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const location = useLocation();

    const [copySuccess, setCopySuccess] = useState('');
    const textAreaRef = useRef(null);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const sessionParam = searchParams.get('sessionId');
        if (sessionParam) {
            console.log("params exist:", sessionParam)
            setSessionId(sessionParam);
            fetchCode(sessionParam);
        } else {
            console.log("create session")
            createSession();
        }
    }, [location.search]);


    const createSession = () => {
        axios.get(API_URL + '/create_session')
            .then((response) => {
                const newSessionId = response.data.sessionId;
                setSessionId(newSessionId);
                window.history.replaceState({}, '', `/?sessionId=${newSessionId}`);
            })
            .catch((error) => {
                console.error('Error al crear la sesión:', error);
            });
    };

    const fetchCode = (sessionId) => {
        axios.get(`${API_URL}/?sessionId=${sessionId}`)
            .then((response) => {
                const code = response.data;
                setCode(code);
            })
            .catch((error) => {
                console.error('Error al obtener el código:', error);
            });
    };

    // useEffect(()=>{
    //     if (sessionId !== '') {
    //         console.log("get code")
    //         fetchCode(sessionId);
    //     } else {
    //         console.log("can't read code")
    //     }
    // },[code])

    function copyToClipboard(e) {
        textAreaRef.current.select();
        document.execCommand('copy');
        e.target.focus();
        setCopySuccess('Copied!');
      }

    const saveCode = () => {
        // console.log("saving code...")
        axios.post(API_URL + '/save', { sessionId, code })
            .then(() => {
                console.log('Código guardado con éxito');
            })
            .catch((error) => {
                console.error('Error al guardar el código:', error);
            });
    };

    const handleCodeChange = (newCode) => {
        setCode(newCode);
        saveCode()
    };

    const RunCode = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(API_URL + '/eval', { code });
            const data = response.data;
            setResult(data);
        } catch (error) {
            console.error('Error al enviar el código:', error);
        }
    };


    const downloadCode = () => {
        const blob = new Blob([code], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = fileName || 'code.txt';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    const shareCode = () => {
        const shareLink = `${window.location.origin}/?sessionId=${sessionId}`;
        // Abre el modal al hacer clic en "Share Code"
        console.log(shareLink)
        setShowModal(true);

        // Copia el enlace al portapapeles
        const textArea = document.createElement('textarea');
        textArea.value = shareLink;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    };

    return (
        <Container>
            <h2>KuberPy cloud IDE</h2>
            <p>by cypherpunks</p>
            <Row>
                <Col md={6}>
                    <Form onSubmit={RunCode}>
                        <Form.Group controlId="fileName">
                            <Form.Control
                                type="text"
                                placeholder="File Name"
                                value={fileName}
                                onChange={(e) => setFileName(e.target.value)}
                            />
                        </Form.Group>
                        <AceEditor
                            mode="python"
                            theme="tomorrow"
                            name="codeEditor"
                            value={code}
                            onChange={handleCodeChange}
                            editorProps={{ $blockScrolling: true }}
                            setOptions={{
                                enableBasicAutocompletion: true,
                                enableLiveAutocompletion: true,
                            }}
                            style={{ width: '100%', height: '400px' }}
                        />
                        <Button variant="primary" type="submit">Run Code</Button>
                        <Button variant="secondary" onClick={downloadCode}>Save Code</Button>
                        {/* Abre el modal al hacer clic en "Share Code" */}
                        <Button variant="info" onClick={shareCode}>Share IDE</Button>
                    </Form>
                </Col>
                <Col md={6}>
                    <div className="console-area">
                        <h5 className='black'>___________________________________________</h5>
                        <ul>
                            {users.map((user) => (
                                <li key={user}>{user}</li>
                            ))}
                        </ul>
                        {result && (
                            <div>
                                {result.error ? (
                                    <pre style={{ color: 'red' }}>{result.error}</pre>
                                ) : (
                                    <pre style={{ color: 'green' }}>{result.output}</pre>
                                )}
                            </div>
                        )}
                    </div>
                </Col>
            </Row>
            {/* Modal para mostrar el enlace de compartir */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Link to share </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* <input type="text" value={`${window.location.origin}/?sessionId=${sessionId}`} readOnly /> */}
                    <div>
                        {
                            /* Logical shortcut for only displaying the 
                               button if the copy command exists */
                            document.queryCommandSupported('copy') &&
                            <div>
                                <Button onClick={copyToClipboard}>Copy Link</Button>
                                {copySuccess}
                            </div>
                        }
                        <form>
                            <textarea
                                ref={textAreaRef}
                                value={`${window.location.origin}/?sessionId=${sessionId}`}
                            />
                        </form>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}