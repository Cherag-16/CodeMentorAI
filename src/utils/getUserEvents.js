// src/utils/getUserEvents.js
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore"; 
import { getAuth } from "firebase/auth";

const db = getFirestore();
const auth = getAuth();

const getUserEvents = async () => {
  const user = auth.currentUser;
  if (user) {
    const q = query(collection(db, "events"), where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);

    const events = [];
    querySnapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() });
    });

    return events;
  }
};

export default getUserEvents;
