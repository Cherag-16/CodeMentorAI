import { ArrowRight } from "lucide-react";

export default function CourseCard({ title, description, creator, onClick }) {
  return (
    <div
      className="bg-white p-5 rounded-2xl shadow-md flex items-center justify-between hover:shadow-lg transition cursor-pointer"
      onClick={onClick}
    >
      <div>
        <h3 className="text-xl font-semibold mb-1">{title}</h3>
        <p className="text-gray-600 text-sm mb-2">{description}</p>
        <p className="text-sm text-gray-500">Created by <span className="font-medium">{creator}</span></p>
      </div>
      <div className="text-purple-600">
        <ArrowRight size={24} />
      </div>
    </div>
  );
}
