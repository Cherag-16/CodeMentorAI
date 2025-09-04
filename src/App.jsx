import { useEffect, useState } from 'react';
import { Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase';

import AuthPage from './pages/AuthPage';
import Dashboard from "./pages/Dashboard";
import ProfilePage from './pages/ProfilePage';
import Friends from './pages/Friends';
import CodePlayground from './pages/CodePlayground'
import AddEventPage from './pages/AddEventPage';
import AllCourses from './pages/AllCourses';
import AIAssistant from './pages/AIAssistant';
import TeamPage from './pages/TeamPage';




function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <AuthPage />} />
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
      <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/" />} />
      <Route path="/friends" element={user ? <Friends /> : <Navigate to="/" />} />
      <Route path="/codeplayground" element={user ? <CodePlayground /> : <Navigate to="/" />} />
      <Route path="/add-event" element={<AddEventPage />} />
      <Route path="/courses" element={<AllCourses />} />
      <Route path="/ai-assistant" element={<AIAssistant />} />
      <Route path="/team" element={<TeamPage />} />
    </Routes>
  );
}

export default App;
