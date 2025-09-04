import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ReactMarkdown from "react-markdown";

export default function AIAssistant() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAskAI = async () => {
    if (!input) return;
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer YOUR_OPENAI_API_KEY`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: input }],
        }),
      });

      const data = await res.json();
      setResponse(data.choices[0].message.content);
    } catch (err) {
      setResponse("Error contacting AI.");
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">AI Study & Code Assistant</h1>
        <textarea
          className="w-full p-4 border rounded mb-4"
          rows="5"
          placeholder="Ask me anything about coding, learning, etc."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={handleAskAI}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? "Thinking..." : "Ask AI"}
        </button>

        {response && (
          <div className="mt-6 p-4 bg-white border rounded shadow">
            <h2 className="text-xl font-semibold mb-2">AI Response:</h2>
            <ReactMarkdown>{response}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
