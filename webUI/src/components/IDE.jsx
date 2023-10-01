
import { useState } from 'react';
import "../style/IDE.css"
import axios from "axios"


export default function PythonCodeAnalyzer() {
    const [code, setCode] = useState('');
    const [fileName, setFileName] = useState('');
    const [result, setResult] = useState(null);

    const RunCode = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${window.location.origin.replace(":5173", "")}:4000/eval`,
                {
                    code: code,
                });

            // server response 
            // console.log(response)
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
        <div>
            <h1>Python Code Analyzer</h1>
            <div className="container">
                <div className="input-area">
                    <form onSubmit={RunCode}>
                        <input
                            type="text"
                            name="file_name"
                            placeholder="File Name"
                            value={fileName}
                            onChange={(e) => setFileName(e.target.value)}
                        />
                        <textarea
                            name="code"
                            rows="10"
                            cols="50"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        ></textarea>
                        <br />
                        <input type="submit" value="Run Code" />
                        <input type="button" value="Save Code" onClick={saveCode} />
                    </form>
                </div>
                <div className="cli-area">
                    {result && (
                        <div>
                            <h2>Analysis Result:</h2>
                            {result.error ? (
                                <pre style={{ color: 'red' }}>{result.error}</pre>
                            ) : (
                                <pre style={{ color: 'green' }}>{result.output}</pre>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
