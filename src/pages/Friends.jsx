import React from 'react';
import { getAuth } from 'firebase/auth';
import FriendSearch from '../components/FriendSearch';
import FriendRequestsList from '../components/FriendRequestsList';
import FriendsList from '../components/FriendsList';
import Sidebar from '../components/Sidebar';

const Friends = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) return <p>Loading...</p>;

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 p-8 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Friends</h1>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Search Users</h2>
          <FriendSearch currentUserId={user.uid} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Friend Requests</h2>
          <FriendRequestsList currentUserId={user.uid} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Your Friends</h2>
          <FriendsList currentUserId={user.uid} />
        </div>
      </div>
    </div>
  );
};

export default Friends;
