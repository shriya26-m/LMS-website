import React, { useState } from "react";

type Course = {
  id: number;
  title: string;
  category: string;
  description: string;
  instructor: string;
  lessons: number;
  rating: number;
  students: number;
  image: string;
};

const courses: Course[] = [
  {
    id: 1,
    title: "Full Stack Web Development",
    category: "Programming",
    description: "Learn MERN stack and build modern web apps.",
    instructor: "John Doe",
    lessons: 20,
    rating: 4.8,
    students: 1200,
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
  },
  {
    id: 2,
    title: "Python for Beginners",
    category: "Programming",
    description: "Start your programming journey with Python.",
    instructor: "Jane Smith",
    lessons: 15,
    rating: 4.7,
    students: 950,
    image:
    "https://images.unsplash.com/photo-1518770660439-4636190af475",
  },
  {
    id: 3,
    title: "UI/UX Design Masterclass",
    category: "Design",
    description: "Learn modern UI/UX design principles.",
    instructor: "Emily Brown",
    lessons: 12,
    rating: 4.6,
    students: 640,
    image:
      "https://images.unsplash.com/photo-1586717799252-bd134ad00e26",
  },
  {
    id: 4,
    title: "Data Structures & Algorithms",
    category: "Computer Science",
    description: "Prepare for coding interviews.",
    instructor: "Michael Lee",
    lessons: 25,
    rating: 4.9,
    students: 1800,
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475",
  },
];

const categories = ["All", "Programming", "Design", "Computer Science"];

const Courses: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredCourses = courses.filter((course) => {
    const matchSearch = course.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      selectedCategory === "All" || course.category === selectedCategory;

    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">

      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Explore Courses
      </h1>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">

        <input
          type="text"
          placeholder="Search courses..."
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border rounded-lg px-4 py-2 shadow-sm"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
          >

            {/* Course Image */}
            <img
              src={course.image}
              alt={course.title}
              className="h-44 w-full object-cover"
            />

            <div className="p-5">

              {/* Category Badge */}
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                {course.category}
              </span>

              {/* Title */}
              <h2 className="text-lg font-semibold mt-2 mb-1">
                {course.title}
              </h2>

              {/* Instructor */}
              <p className="text-sm text-gray-500 mb-2">
                by {course.instructor}
              </p>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4">
                {course.description}
              </p>

              {/* Stats */}
              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <span>⭐ {course.rating}</span>
                <span>{course.lessons} lessons</span>
                <span>{course.students} students</span>
              </div>

              {/* Button */}
              <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg hover:opacity-90 transition">
                View Course
              </button>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default Courses;