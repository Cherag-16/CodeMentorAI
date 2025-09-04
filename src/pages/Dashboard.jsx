import { useEffect, useState } from 'react';
import Sidebar from "../components/Sidebar";
import CourseCard from "../components/CourseCard";
import UserList from "../components/UserList";
import ProfileMenu from '../components/ProfileMenu';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs, limit, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function Dashboard() {
  const [photoURL, setPhotoURL] = useState('');
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [recentCourses, setRecentCourses] = useState([]);
  const [languageProgress, setLanguageProgress] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const fetchEvents = async () => {
      const q = query(collection(db, "events"), where("uid", "==", user.uid));
      const snapshot = await getDocs(q);
      const fetchedEvents = snapshot.docs.map(doc => doc.data());
      setEvents(fetchedEvents);
    };

    const fetchCourses = async () => {
      const q = query(collection(db, "courses"));
      const snapshot = await getDocs(q);
      const courses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecentCourses(courses);
    };

    const fetchLanguageProgress = async () => {
      const docRef = doc(db, "language_progress", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLanguageProgress(docSnap.data());
      }
    };

    fetchEvents();
    fetchCourses();
    fetchLanguageProgress();

    setPhotoURL(user.photoURL || '');
  }, []);

  const handleDateClick = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    const eventForSelectedDate = events.filter(ev => ev.date === dateStr);
    setSelectedEvents(eventForSelectedDate);
    setCalendarDate(date);
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toISOString().split("T")[0];
      const eventForThisDate = events.find(ev => ev.date === dateStr);
      return eventForThisDate ? (
        <div className="text-blue-500 text-center text-xl leading-none">•</div>
      ) : null;
    }
  };

  const handleCourseClick = (link) => {
    if (link) {
      window.open(link, "_blank");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 p-6 bg-white shadow-md rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <ProfileMenu />
          </div>
        </div>

        <div className="flex gap-6">
          <div className="flex-1 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Courses</h2>
            <div className="space-y-4">
              {recentCourses.map(course => (
                <div key={course.id} onClick={() => handleCourseClick(course.link)} className="cursor-pointer bg-gray-100 p-4 rounded-lg shadow hover:bg-gray-200 transition duration-300 ease-in-out">
                  <CourseCard
                    title={course.title}
                    description={course.description}
                    creator={course.level}
                  />
                </div>
              ))}
            </div>

            {languageProgress && (
              <div className="mt-8 bg-gray-50 p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Current Learning</h2>
                <LanguageCard
                  language={languageProgress.language}
                  progress={languageProgress.progress}
                  timeSpent={languageProgress.timeSpent}
                />
              </div>
            )}
          </div>

          <div className="w-80 space-y-6">
            <Calendar
              onChange={setCalendarDate}
              value={calendarDate}
              tileContent={tileContent}
              onClickDay={handleDateClick}
              className="shadow-lg rounded-lg"
            />
            <UserList />
          </div>
        </div>

        {selectedEvents.length > 0 && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Events on {calendarDate.toDateString()}</h2>
            <ul className="space-y-4">
              {selectedEvents.map((event, index) => (
                <li key={index} className="bg-white p-4 rounded-lg shadow-md hover:bg-gray-50 transition duration-300 ease-in-out">
                  <h3 className="font-semibold text-xl text-gray-900">{event.title}</h3>
                  <p className="text-gray-700">{event.description}</p>
                  <p className="text-sm text-gray-500">{event.date}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
