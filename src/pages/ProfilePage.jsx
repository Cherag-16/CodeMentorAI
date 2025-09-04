import React, { useEffect, useState } from "react";
import { getAuth, updateProfile, updateEmail, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";
import { db } from "../firebase";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  const [username, setUsername] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [editMode, setEditMode] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.displayName);
      setEmail(user.email);
      setPhotoURL(user.photoURL);
    }
  }, [user]);

  const handleSave = async () => {
    try {
      await updateProfile(user, { displayName: username });
      if (user.email !== email) {
        await updateEmail(user, email);
      }
      toast.success("Profile updated successfully!");
      setEditMode(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword) return toast.warn("Enter both passwords");

    const credential = EmailAuthProvider.credential(user.email, oldPassword);
    try {
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      toast.success("Password updated!");
      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `profilePics/${user.uid}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await updateProfile(user, { photoURL: url });
      setPhotoURL(url);
      toast.success("Profile picture updated!");
    } catch (error) {
      toast.error(error.message);
    }
    setUploading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg mt-10">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      <div className="flex items-center gap-4 mb-4">
        <img
          src={photoURL || "https://via.placeholder.com/100"}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover border"
        />
        <label className="text-blue-600 cursor-pointer">
          Change Picture
          <input type="file" onChange={handleImageUpload} className="hidden" />
        </label>
        {uploading && <span className="text-sm text-gray-500">Uploading...</span>}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Username</label>
        <input
          className="border p-2 w-full rounded"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={!editMode}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Email</label>
        <input
          className="border p-2 w-full rounded"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={!editMode}
        />
      </div>

      {editMode ? (
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={handleSave}
        >
          Save Changes
        </button>
      ) : (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setEditMode(true)}
        >
          Edit Profile
        </button>
      )}

      <hr className="my-6" />

      <h3 className="text-xl font-semibold mb-2">Change Password</h3>
      <div className="mb-2">
        <input
          className="border p-2 w-full rounded"
          placeholder="Current password"
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <input
          className="border p-2 w-full rounded"
          placeholder="New password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <button
        className="bg-purple-600 text-white px-4 py-2 rounded"
        onClick={handlePasswordChange}
      >
        Update Password
      </button>
    </div>
  );
};

export default Profile;
