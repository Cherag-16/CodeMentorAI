import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="w-64 bg-white text-gray-800 flex flex-col p-6 shadow-lg rounded-tr-3xl border-r border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-900 mb-10">CodeMentorAI</h2>
      <nav className="space-y-4">
        <Link
          to="/dashboard"
          className="block px-4 py-2 rounded-lg hover:bg-blue-100 hover:text-blue-600 transition duration-200 ease-in-out">
          Dashboard
        </Link>
        <Link
          to="/courses"
          className="block px-4 py-2 rounded-lg hover:bg-blue-100 hover:text-blue-600 transition duration-200 ease-in-out">
          All Courses
        </Link>
        <Link
          to="/codeplayground"
          className="block px-4 py-2 rounded-lg hover:bg-blue-100 hover:text-blue-600 transition duration-200 ease-in-out">
          CodePlayground
        </Link>
        <Link
          to="/messages"
          className="block px-4 py-2 rounded-lg hover:bg-blue-100 hover:text-blue-600 transition duration-200 ease-in-out">
          Messages
        </Link>
        <Link
          to="/friends"
          className="block px-4 py-2 rounded-lg hover:bg-blue-100 hover:text-blue-600 transition duration-200 ease-in-out">
          Friends
        </Link>
        <Link
          to="/ai-assistant"
          className="block px-4 py-2 rounded-lg hover:bg-blue-100 hover:text-blue-600 transition duration-200 ease-in-out">
          AI Assistant
        </Link>
        <Link
          to="/team"
          className="block px-4 py-2 rounded-lg hover:bg-blue-100 hover:text-blue-600 transition duration-200 ease-in-ou">
          Team
        </Link>


      </nav>
    </div>
  );
}
