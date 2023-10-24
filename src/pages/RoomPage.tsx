import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  query,
  orderBy,
  addDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useParams } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

interface Message {
  sender: string;
  senderName: string;
  text: string;
  timestamp: string;
}

function RoomPage() {
  const [user] = useAuthState(auth);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [roomName, setRoomName] = useState("");
  const { roomId } = useParams();

  const handleSendMessage = async () => {
    if (message.trim() !== "") {
      await createMessage(roomId || "", message, user?.uid || ""); // Assuming you pass the roomId and userId to this component
      setMessage(""); // Reset the input field after sending the message
    }
  };

  useEffect(() => {
    if (roomId) {
      const unsubscribe = onSnapshot(
        query(
          collection(doc(db, "rooms", roomId as string), "messages"),
          orderBy("timestamp", "asc")
        ),
        (snapshot) => {
          setMessages(
            snapshot.docs.map((doc) => ({
              sender: doc.data().sender,
              senderName: doc.data().senderName,
              text: doc.data().text,
              timestamp: doc.data().timestamp,
            }))
          );
        }
      );

      onSnapshot(doc(db, "rooms", roomId), (doc) => {
        if (doc.data()) {
            setRoomName(doc.data()?.name)
        }
      });

      return () => unsubscribe();
    }
  }, [roomId]);

  const createMessage = async (
    roomId: string,
    messageText: string,
    senderId: string,
  ) => {
    try {
      const roomRef = doc(db, "rooms", roomId); // Reference to the specific room
      const messagesCollectionRef = collection(roomRef, "messages"); // Reference to the messages sub-collection

      await addDoc(messagesCollectionRef, {
        text: messageText,
        timestamp: new Date().toISOString(),
        sender: senderId,
        senderName: user?.displayName,
      });

      console.log("Message added to room:", roomId);
    } catch (error) {
      console.error("Error adding message:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-6">
      <h2 className="text-2xl mb-6">Room: {roomName}</h2>
      <div className="flex flex-col gap-2 my-4 h-[70vh] overflow-auto">
        {messages.map((message) => (
          <>
            {message.sender === user?.uid ? (
              <div
                className="w-full flex justify-end gap-1"
                key={message.timestamp}
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex justify-center items-center font-bold">
                  {message?.senderName ? message?.senderName[0] : "U"}
                </div>
                <p
                  key={message.timestamp}
                  className="bg-blue-500 text-white py-1 px-4 rounded-md max-w-xs"
                >
                  {message.text}
                </p>
              </div>
            ) : (
              <div
                className="w-full flex gap-2 items-start"
                key={message.timestamp}
              >
                <div className="w-8 h-8 rounded-full bg-gray-200 flex justify-center items-center font-bold">
                  {message?.senderName ? message?.senderName[0] : "U"}
                </div>
                <p
                  key={message.timestamp}
                  className="inline-block bg-gray-200 py-1 px-4 rounded-md max-w-xs"
                >
                  {message.text}
                </p>
              </div>
            )}
          </>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <input
          className="w-full border-2 border-blue-500 py-1 px-2 rounded-md"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          placeholder="Type your message..."
          autoFocus
        />
        <button
          onClick={handleSendMessage}
          className="bg-slate-500 text-white py-1 px-4 rounded-md"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default RoomPage;
