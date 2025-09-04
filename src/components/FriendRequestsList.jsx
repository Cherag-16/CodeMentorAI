import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import {
  acceptFriendRequest,
  declineFriendRequest,
} from '../services/friendService';

const FriendRequestsList = ({ currentUserId }) => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, 'friend_requests'),
      where('to', '==', currentUserId),
      where('status', '==', 'pending')
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRequests(data);
    });

    return () => unsub();
  }, [currentUserId]);

  return (
    <div>
      <h2>Pending Friend Requests</h2>
      {requests.length === 0 ? (
        <p>No requests</p>
      ) : (
        requests.map((req) => (
          <div key={req.id} className="mb-2">
            <span>{req.from}</span>
            <button className="ml-2" onClick={() => acceptFriendRequest(req.id)}>Accept</button>
            <button className="ml-2" onClick={() => declineFriendRequest(req.id)}>Decline</button>
          </div>
        ))
      )}
    </div>
  );
};

export default FriendRequestsList;
