// components/Chat.tsx

import { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from '../../firebase';

interface Message {
  id: string;
  data: {
    text: string;
    timestamp: string;
  };
}

function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, "messages"), orderBy("timestamp", "asc")), (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() as Message['data'] })));
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, "messages"), {
      text: input,
      timestamp: new Date().toISOString()
    });
    setInput('');
  }

  return (
    <div>
      {messages.map(message => (
        <p key={message.id}>{message.data.text}</p>
      ))}
      <form onSubmit={sendMessage}>
        <input value={input} onChange={e => setInput(e.target.value)} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chat;
