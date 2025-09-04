import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function TeamChat({ teamId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!teamId) return;

    const messagesRef = collection(db, "teams", teamId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [teamId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const messageData = {
      uid: user.uid,
      displayName: user.displayName || "Anonymous",
      text: newMessage,
      timestamp: serverTimestamp()
    };

    await addDoc(collection(db, "teams", teamId, "messages"), messageData);
    setNewMessage("");
  };

  return (
    <div className="bg-white shadow-md p-4 rounded h-[400px] flex flex-col">
      <div className="overflow-y-auto flex-1 mb-4 space-y-2">
        {messages.map(msg => (
          <div key={msg.id} className="p-2 rounded bg-gray-100">
            <span className="font-semibold">{msg.displayName}: </span>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 border p-2 rounded"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
