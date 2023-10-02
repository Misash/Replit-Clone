
// import { useState } from 'react';
// import "../style/IDE.css"
// import axios from "axios"


// export default function PythonCodeAnalyzer() {
//     const [code, setCode] = useState('');
//     const [fileName, setFileName] = useState('');
//     const [result, setResult] = useState(null);

//     const RunCode = async (e) => {
//         e.preventDefault();

//         try {
//             const response = await axios.post(`http://192.168.49.2:30706/eval`,
//                 {
//                     code: code,
//                 });

//             // server response 
//             // console.log(response)
//             setResult(response.data);
            
//         } catch (error) {
//             console.error('Error to sent Code:', error);
//         }
//     };

//     const saveCode = () => {
//         const blob = new Blob([code], { type: 'text/plain' });
//         const a = document.createElement('a');
//         a.href = URL.createObjectURL(blob);
//         a.download = fileName || 'code.txt';
//         a.style.display = 'none';
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//     };

//     return (
//         <div>
//             <h1>Python Code Analyzer</h1>
//             <div className="container">
//                 <div className="input-area">
//                     <form onSubmit={RunCode}>
//                         <input
//                             type="text"
//                             name="file_name"
//                             placeholder="File Name"
//                             value={fileName}
//                             onChange={(e) => setFileName(e.target.value)}
//                         />
//                         <textarea
//                             name="code"
//                             rows="10"
//                             cols="50"
//                             value={code}
//                             onChange={(e) => setCode(e.target.value)}
//                         ></textarea>
//                         <br />
//                         <input type="submit" value="Run Code" />
//                         <input type="button" value="Save Code" onClick={saveCode} />
//                     </form>
//                 </div>
//                 <div className="cli-area">
//                     {result && (
//                         <div>
//                             <h2>Analysis Result:</h2>
//                             {result.error ? (
//                                 <pre style={{ color: 'red' }}>{result.error}</pre>
//                             ) : (
//                                 <pre style={{ color: 'green' }}>{result.output}</pre>
//                             )}
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }


import { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import AceEditor from 'react-ace';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { API_URL } from '../../config';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-tomorrow';
import 'ace-builds/src-noconflict/ext-language_tools';
import '../style/IDE.css';

export default function PythonCodeAnalyzer() {
    const [code, setCode] = useState('');
    const [fileName, setFileName] = useState('');
    const [result, setResult] = useState(null);

    const handleCodeChange = (newCode) => {
        // Handle code changes here if needed
        setCode(newCode)
    };

    const RunCode = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${API_URL}/eval`, {
                code: code,
            });

            setResult(response.data);
        } catch (error) {
            console.error('Error to sent Code:', error);
        }
    };

    const saveCode = () => {
        const blob = new Blob([code], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = fileName || 'code.txt';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <Container>
        <h2> KuberPy cloud IDE</h2>
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
                    <Button variant="secondary" onClick={saveCode}>Save Code</Button>
                </Form>
            </Col>
            <Col md={6}>
                {result && (
                    <div>
                        <h2>Analysis Result:</h2>
                        {result.error ? (
                            <Alert variant="danger">{result.error}</Alert>
                        ) : (
                            <Alert variant="success">{result.output}</Alert>
                        )}
                    </div>
                )}
            </Col>
        </Row>
    </Container>
    );
}
