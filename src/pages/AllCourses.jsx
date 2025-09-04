import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import CourseCard from "../components/CourseCard";
import Sidebar from "../components/Sidebar";

export default function AllCourses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const coursesCollection = collection(db, "courses");
      const snapshot = await getDocs(coursesCollection);
      const coursesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCourses(coursesList);
    };

    fetchCourses();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      <Sidebar />
      <div className="flex flex-col w-full p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">All Courses</h1>
        <div className="space-y-6">
          {courses.map(course => (
            <div
              key={course.id}
              onClick={() => window.open(course.link, "_blank")}
              className="cursor-pointer"
            >
              <CourseCard
                title={course.title}
                description={course.description}
                creator={course.level}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
