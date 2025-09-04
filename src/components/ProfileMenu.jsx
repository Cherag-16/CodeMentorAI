import { useState, useEffect, useRef } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    photoURL: "",
  });
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserData({
        name: user.displayName || "User",
        email: user.email || "",
        photoURL: user.photoURL || "https://via.placeholder.com/40",
      });
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="relative" ref={menuRef}>
      <img
        src={userData.photoURL}
        alt="Profile"
        className="w-10 h-10 rounded-full border cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        title="Account Menu"
      />
      <div
        className={`absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 transition-all duration-200 ease-in-out origin-top-right transform ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        <div className="p-4 border-b border-gray-200">
          <p className="text-sm font-semibold">{userData.name}</p>
          <p className="text-xs text-gray-500 truncate">{userData.email}</p>
        </div>
        <ul className="text-sm text-gray-700">
          <li
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              navigate("/profile");
              setIsOpen(false);
            }}
          >
            View Profile
          </li>
          <li
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
            onClick={handleLogout}
          >
            Logout
          </li>
        </ul>
      </div>
    </div>
  );
}
