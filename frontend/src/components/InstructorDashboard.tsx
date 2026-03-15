import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Users,
  FileText,
  Star,
  Calendar,
  Bell,
  LogOut,
  GraduationCap
} from "lucide-react";

interface Course {
  id: number;
  name: string;
  students: number;
  rating: number;
}

export default function InstructorDashboard() {

  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("name");
    if (!name) navigate("/login");
    setUserName(name || "");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const stats = [
    { title: "Courses", value: "8", icon: BookOpen },
    { title: "Students", value: "156", icon: Users },
    { title: "Pending Reviews", value: "23", icon: FileText },
    { title: "Rating", value: "4.8", icon: Star }
  ];

  const courses: Course[] = [
    { id: 1, name: "Advanced React", students: 45, rating: 4.9 },
    { id: 2, name: "Python Basics", students: 78, rating: 4.7 },
    { id: 3, name: "Database Design", students: 33, rating: 4.8 }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-5 flex flex-col justify-between">

        <div>
          <div className="flex items-center gap-2 mb-8">
            <GraduationCap className="text-indigo-600"/>
            <h2 className="font-bold text-lg">LearnHub</h2>
          </div>

          <div className="space-y-2">
            <button className="p-2 hover:bg-gray-100 rounded w-full text-left">
              Dashboard
            </button>
            <button className="p-2 hover:bg-gray-100 rounded w-full text-left">
              My Courses
            </button>
            <button className="p-2 hover:bg-gray-100 rounded w-full text-left">
              Students
            </button>
            <button className="p-2 hover:bg-gray-100 rounded w-full text-left">
              Analytics
            </button>
          </div>
        </div>

        <button onClick={handleLogout} className="flex gap-2 text-red-500">
          <LogOut size={18}/> Logout
        </button>

      </div>

      {/* Main */}
      <div className="flex-1 p-8">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">
            Welcome Instructor {userName} 👨‍🏫
          </h1>

          <Bell/>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white p-5 rounded shadow">
                <Icon className="text-indigo-600 mb-2"/>
                <h2 className="text-xl font-bold">{stat.value}</h2>
                <p className="text-gray-500 text-sm">{stat.title}</p>
              </div>
            );
          })}
        </div>

        {/* Courses */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="font-semibold mb-4">My Courses</h2>

          <div className="space-y-4">
            {courses.map(course => (
              <div key={course.id} className="border p-4 rounded flex justify-between">

                <div>
                  <h3 className="font-semibold">{course.name}</h3>
                  <p className="text-sm text-gray-500">
                    {course.students} students
                  </p>
                </div>

                <p className="text-yellow-500">
                  ⭐ {course.rating}
                </p>

              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}