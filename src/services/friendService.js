import { db } from '../firebase';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';

// Send a friend request
export const sendFriendRequest = async (fromUid, toUid) => {
  const requestRef = doc(collection(db, 'friend_requests'));
  await setDoc(requestRef, {
    from: fromUid,
    to: toUid,
    status: 'pending',
    timestamp: Timestamp.now(),
  });
};

// Cancel a sent friend request
export const cancelFriendRequest = async (fromUid, toUid) => {
  const q = query(
    collection(db, 'friend_requests'),
    where('from', '==', fromUid),
    where('to', '==', toUid),
    where('status', '==', 'pending')
  );
  const snapshot = await getDocs(q);
  snapshot.forEach(async (docSnap) => {
    await deleteDoc(doc(db, 'friend_requests', docSnap.id));
  });
};

// Accept friend request
export const acceptFriendRequest = async (requestId) => {
  const requestRef = doc(db, 'friend_requests', requestId);
  const requestSnap = await getDoc(requestRef);
  const { from, to } = requestSnap.data();

  await updateDoc(requestRef, { status: 'accepted' });

  const friendshipId = [from, to].sort().join('_');
  await setDoc(doc(db, 'friends', friendshipId), {
    users: [from, to],
    since: Timestamp.now(),
  });
};

// Decline friend request
export const declineFriendRequest = async (requestId) => {
  const requestRef = doc(db, 'friend_requests', requestId);
  await updateDoc(requestRef, { status: 'declined' });
};
