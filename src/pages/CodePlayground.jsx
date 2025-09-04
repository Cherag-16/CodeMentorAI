import { useState } from 'react';
import Sidebar from '../components/Sidebar';  // Assuming Sidebar is a separate component

export default function CodePlayground() {
  const [selectedLang, setSelectedLang] = useState('python');
  const [code, setCode] = useState('print("Hello, CodeMentorAI!")');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const languageIds = {
    python: 71,
    javascript: 63,
    c: 50,
    java: 62
  };

  const handleRun = async () => {
    setLoading(true);
    setOutput('');

    try {
      const response = await fetch(
        'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true',
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': 'de8de5e80amsh2e9f509c552ab47p1b9755jsnc32d4a7b90d0',
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
          },
          body: JSON.stringify({
            language_id: languageIds[selectedLang],
            source_code: code,
            stdin: ''
          })
        }
      );

      const data = await response.json();
      setOutput(data.stdout || data.stderr || data.compile_output || 'No output');
    } catch (error) {
      console.error(error);
      setOutput('Something went wrong while executing the code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-8 space-y-6">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">Code Playground</h1>

        {/* Code Playground Card */}
        <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md">
          {/* Language Selection */}
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700 mb-2">Select Language</label>
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="c">C</option>
              <option value="java">Java</option>
            </select>
          </div>

          {/* Code Editor */}
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700 mb-2">Write Your Code</label>
            <textarea
              className="w-full h-48 p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Write your code here..."
            />
          </div>

          {/* Run Button */}
          <div className="flex justify-between items-center">
            <button
              onClick={handleRun}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md transition duration-300"
            >
              {loading ? 'Running...' : 'Run Code'}
            </button>
          </div>

          {/* Output */}
          <div className="mt-6 p-4 bg-gray-100 border border-gray-300 rounded-md text-gray-800">
            <h3 className="text-xl font-semibold mb-2">Output</h3>
            <pre className="whitespace-pre-wrap">{output}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
