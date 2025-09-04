import React, { useEffect, useState } from 'react';
import {
  sendFriendRequest,
  cancelFriendRequest
} from '../services/friendService';
import { db } from '../firebase';
import {
  query,
  collection,
  where,
  onSnapshot
} from 'firebase/firestore';

const FriendRequestButton = ({ currentUserId, targetUserId }) => {
  const [status, setStatus] = useState('none');

  useEffect(() => {
    const q = query(
      collection(db, 'friend_requests'),
      where('from', '==', currentUserId),
      where('to', '==', targetUserId)
    );
    const unsub = onSnapshot(q, snapshot => {
      if (snapshot.empty) {
        setStatus('none');
      } else {
        const req = snapshot.docs[0].data();
        setStatus(req.status);
      }
    });

    return () => unsub();
  }, [currentUserId, targetUserId]);

  const handleSend = async () => {
    await sendFriendRequest(currentUserId, targetUserId);
    setStatus('pending');
  };

  const handleCancel = async () => {
    await cancelFriendRequest(currentUserId, targetUserId);
    setStatus('none');
  };

  if (status === 'accepted') return <span className="text-green-600">Friends</span>;
  if (status === 'pending') return <button onClick={handleCancel} className="text-yellow-600">Cancel Request</button>;

  return <button onClick={handleSend} className="text-blue-600">Send Request</button>;
};

export default FriendRequestButton;
