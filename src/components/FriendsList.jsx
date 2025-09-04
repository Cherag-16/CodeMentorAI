import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';

const FriendsList = ({ currentUserId }) => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, 'friends'),
      where('users', 'array-contains', currentUserId)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => {
        const otherUid = doc.data().users.find(uid => uid !== currentUserId);
        return otherUid;
      });
      setFriends(list);
    });

    return () => unsub();
  }, [currentUserId]);

  return (
    <div>
      <h2>My Friends</h2>
      {friends.length === 0 ? (
        <p>No friends yet</p>
      ) : (
        <ul>
          {friends.map((uid) => (
            <li key={uid}>{uid}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendsList;
