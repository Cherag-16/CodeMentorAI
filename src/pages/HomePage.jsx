import { useEffect, useState } from 'react';
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from '../firebase';

function HomePage({ navigate }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        // Get additional user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.userId));
          if (userDoc.exists()) {
            setUser({
              ...currentUser,
              ...userDoc.data()
            });
          } else {
            setUser(currentUser);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(currentUser);
        }
      } else {
        // Redirect to login if not authenticated
        navigate('/');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      {user && (
        <div className="mb-6 text-center">
          <p className="text-xl mb-2">Welcome, {user.displayName || user.username}!</p>
          <p className="text-gray-600">{user.email}</p>
        </div>
      )}
      <button 
        onClick={handleLogout}
        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
      >
        Log Out
      </button>
    </div>
  );
}

export default HomePage;