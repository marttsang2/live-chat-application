// pages/Rooms.tsx

import { useEffect, useState } from "react";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { Link } from "react-router-dom";
import Modal from "../components/modal/Modal";

interface Room {
  id: string;
  name: string;
}

function HomePage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [newRoomName, setNewRoomName] = useState<string>("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "rooms"), (snapshot) => {
      setRooms(
        snapshot.docs.map((doc) => ({ id: doc.id, name: doc.data().name }))
      );
    });

    return () => unsubscribe();
  }, []);

  const createNewRoom = async (e:  React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "rooms"), {
        name: newRoomName,
      });
    } catch (error) {
      console.error("Error creating room: ", error);
    }
    setNewRoomName("");
    setShowModal(false);
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-4 mt-6">
      <Modal isOpen={showModal} setIsOpen={setShowModal}>
        <form onSubmit={createNewRoom}>
          <input 
            className="border-2 border-gray-300 p-2 rounded-md min-w-[320px] my-4"
            type="text"
            placeholder="Please enter room name"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            required
          />
          <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white py-1 px-4 rounded-md"
          >Create Room</button>
          </div>
        </form>
      </Modal>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{`Available Rooms (${rooms.length})`}</h2>
        <button className="border-2 border-blue-500 py-2 px-4 rounded-md" onClick={() => setShowModal(true)}>
          Create Room
        </button>
      </div>
      {rooms.map((room) => (
        <Link
          to={`/room/${room.id}`}
          type="button"
          key={room.id}
          className="w-full border-2 py-2 px-4 rounded-md"
        >
          <a>{room.name}</a>
        </Link>
      ))}
    </div>
  );
}

export default HomePage;
