// src/components/UserList.jsx
const users = [
  { name: "Maren Maureen", id: "1094882001" },
  { name: "Jennifer Jane", id: "1094672000" },
  { name: "Ryan Herwinds", id: "1094342001" },
  { name: "Kierra Culhane", id: "1094682002" },
];

export default function UserList() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-md">
      <h4 className="text-lg font-semibold mb-4">Online Users</h4>
      <ul className="space-y-3">
        {users.map((user, i) => (
          <li key={i} className="flex items-center gap-3">
            <img
              src={`https://i.pravatar.cc/40?img=${i + 10}`}
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-gray-500">{user.id}</p>
            </div>
          </li>
        ))}
      </ul>
      <a href="#" className="text-sm text-purple-600 mt-3 block text-right">See all</a>
    </div>
  );
}
