// src/utils/addEvent.js
import { getFirestore, collection, addDoc } from "firebase/firestore"; 
import { getAuth } from "firebase/auth"; 

const db = getFirestore();
const auth = getAuth();

const addEvent = async (event) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const docRef = await addDoc(collection(db, "events"), {
        title: event.title,
        description: event.description,
        date: event.date,
        uid: user.uid,
      });
      console.log("Event added with ID: ", docRef.id);
    }
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export default addEvent;
