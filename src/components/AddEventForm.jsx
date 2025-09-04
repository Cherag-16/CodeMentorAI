import { useState } from 'react';
import addEvent from '../utils/addEvent';

const AddEventForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const event = { title, description, date };
    addEvent(event);
    setTitle('');
    setDescription('');
    setDate('');
  };

  return (
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
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="px-4 py-2 rounded-lg border"
      />
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">Add Event</button>
    </form>
  );
};

export default AddEventForm;
