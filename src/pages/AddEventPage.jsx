import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';

const AddEventPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const date = queryParams.get('date');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    try {
      await addDoc(collection(db, "events"), {
        title,
        description,
        date,
        uid: user.uid,
      });
      navigate('/dashboard'); 
    } catch (error) {
      console.error("Error adding event: ", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl mb-4">Add Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="px-4 py-2 rounded-lg border"
        />
        <textarea
          placeholder="Event Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="px-4 py-2 rounded-lg border"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
          Save Event
        </button>
      </form>
    </div>
  );
};

export default AddEventPage;
