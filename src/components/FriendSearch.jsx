import React, { useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import FriendRequestButton from './FriendRequestButton';

const FriendSearch = ({ currentUserId }) => { 
  const [username, setUsername] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const q = query(
      collection(db, 'users'),
      where('username', '==', username)
    );
    const snapshot = await getDocs(q);
    const users = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(user => user.id !== currentUserId);
    setResults(users);
  };

  return (
    <div className="mb-4">
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          placeholder="Search username..."
          className="border p-2 rounded w-full"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 rounded" onClick={handleSearch}>
          Search
        </button>
      </div>
      {results.length > 0 && (
        <div>
          {results.map(user => (
            <div key={user.id} className="border p-2 rounded mb-2 flex justify-between items-center">
              <div>{user.username}</div>
              <FriendRequestButton currentUserId={currentUserId} targetUserId={user.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendSearch;
