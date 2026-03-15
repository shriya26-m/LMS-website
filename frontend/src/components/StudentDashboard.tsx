import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  Calendar, 
  Award, 
  TrendingUp,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
  Settings,
  Home,
  BookMarked,
  CheckSquare,
  Clock,
  Video,
  FileText,
  MessageCircle,
  Star,
  BarChart3,
  GraduationCap,
  AlertCircle,
  PlayCircle,
  CheckCircle,
  Download,
  Users,
  Filter,
  Search,
  Moon,
  Sun
} from "lucide-react";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Alex Johnson");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("overview");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const stats = [
    { title: "Enrolled Courses", value: "6", icon: BookOpen, color: "from-blue-500 to-blue-600", bgColor: "bg-blue-50", iconColor: "text-blue-600", trend: "+2 this month" },
    { title: "Completed Courses", value: "12", icon: Award, color: "from-green-500 to-green-600", bgColor: "bg-green-50", iconColor: "text-green-600", trend: "3 this week" },
    { title: "Learning Hours", value: "164", icon: Clock, color: "from-purple-500 to-purple-600", bgColor: "bg-purple-50", iconColor: "text-purple-600", trend: "12 hours this week" },
    { title: "Achievements", value: "24", icon: Star, color: "from-yellow-500 to-yellow-600", bgColor: "bg-yellow-50", iconColor: "text-yellow-600", trend: "3 new this month" },
  ];

  const courses = [
    {
      id: 1,
      name: "Web Development Bootcamp 2024",
      description: "Complete full-stack web development course",
      progress: 75,
      instructor: "Dr. Sarah Chen",
      dueDate: "Dec 15, 2024",
      thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
      level: "Intermediate",
      lastAccessed: "2 hours ago",
      rating: 4.9,
      modules: [
        { id: 1, title: "HTML & CSS Fundamentals", completed: true, lessons: 12 },
        { id: 2, title: "JavaScript Essentials", completed: false, lessons: 15 },
        { id: 3, title: "React Development", completed: false, lessons: 20 }
      ]
    },
    {
      id: 2,
      name: "Data Science Fundamentals",
      description: "Master Python, pandas, and machine learning basics",
      progress: 45,
      instructor: "Prof. Michael Roberts",
      dueDate: "Dec 20, 2024",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
      level: "Beginner",
      lastAccessed: "1 day ago",
      rating: 4.7
    },
    {
      id: 3,
      name: "UI/UX Design Masterclass",
      description: "Learn design thinking and prototyping",
      progress: 30,
      instructor: "Emma Davis",
      dueDate: "Jan 10, 2025",
      thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
      level: "Intermediate",
      lastAccessed: "3 days ago",
      rating: 4.8
    }
  ];

  const assignments = [
    { id: 1, title: "React E-commerce App", course: "Web Development", due: "Tomorrow", priority: "High", status: "pending", type: "Project" },
    { id: 2, title: "Data Analysis Report", course: "Data Science", due: "Dec 18, 2024", priority: "Medium", status: "submitted", type: "Report" },
    { id: 3, title: "Wireframe Design", course: "UI/UX Design", due: "Dec 22, 2024", priority: "Low", status: "graded", grade: "92/100", type: "Design" },
    { id: 4, title: "JavaScript Algorithms", course: "Web Development", due: "Dec 25, 2024", priority: "High", status: "pending", type: "Coding" }
  ];

  const notifications = [
    { id: 1, message: "New course material: React Hooks", time: "2 hours ago", read: false, type: "info" },
    { id: 2, message: "Assignment graded: Web Project - 95%", time: "1 day ago", read: true, type: "grade" },
    { id: 3, message: "Live session today at 3 PM", time: "2 days ago", read: true, type: "warning" }
  ];

  const achievements = [
    { id: 1, title: "Quick Learner", description: "Completed 5 courses", icon: "🚀", date: "Dec 10, 2024" },
    { id: 2, title: "Perfect Score", description: "100% on 3 assignments", icon: "🏆", date: "Dec 5, 2024" },
    { id: 3, title: "React Master", description: "Complete React track", icon: "⚛️", progress: 75 }
  ];

  const events = [
    { id: 1, title: "Live Q&A: React Best Practices", type: "live", date: "Today", time: "3:00 PM", course: "Web Development" },
    { id: 2, title: "Assignment Deadline", type: "deadline", date: "Tomorrow", time: "11:59 PM", course: "Data Science" }
  ];

  const getPriorityBadge = (priority: string) => {
    const styles = {
      High: "bg-red-100 text-red-700",
      Medium: "bg-yellow-100 text-yellow-700",
      Low: "bg-green-100 text-green-700"
    };
    return styles[priority as keyof typeof styles] || "bg-gray-100 text-gray-700";
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      submitted: "bg-blue-100 text-blue-700",
      graded: "bg-green-100 text-green-700"
    };
    return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className={`flex h-screen ${isDarkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-80' : 'w-24'} bg-white dark:bg-gray-900 shadow-2xl transition-all duration-300 flex flex-col border-r border-gray-200 dark:border-gray-800`}>
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          {isSidebarOpen && (
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-linear-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                LearnHub
              </span>
            </div>
          )}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* User Profile */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {userName.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-white dark:border-gray-900 rounded-full"></div>
            </div>
            {isSidebarOpen && (
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{userName}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">👨‍🎓 Student</p>
                <p className="text-xs text-gray-400 mt-1">alex.j@example.com</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          {[
            { icon: Home, label: "Overview", count: null },
            { icon: BookOpen, label: "My Courses",path:"./courses", count: courses.length },
            { icon: Calendar, label: "Schedule", count: events.length },
            { icon: CheckSquare, label: "Assignments", count: assignments.filter(a => a.status === 'pending').length },
            { icon: MessageCircle, label: "Messages", count: 3 },
            { icon: Award, label: "Achievements", count: achievements.length },
            { icon: Users, label: "Community", count: null },
            { icon: Settings, label: "Settings", count: null }
          ].map((item, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(item.label.toLowerCase())}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all mb-1 ${
                activeTab === item.label.toLowerCase()
                  ? 'bg-linear-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 text-indigo-600'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <item.icon size={20} />
              {isSidebarOpen && (
                <>
                  <span className="flex-1 text-left font-medium">{item.label}</span>
                  {item.count && (
                    <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600">
                      {item.count}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors">
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
        {/* Header */}
        <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Welcome back, {userName.split(' ')[0]}! 👋
                </h1>
                <p className="text-gray-500 flex items-center gap-2 mt-1">
                  <Calendar size={14} /> {formatDate(currentTime)} • <Clock size={14} /> {formatTime(currentTime)}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Search courses..." className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64" />
                </div>

                {/* Dark Mode Toggle */}
                <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                {/* Notifications */}
                <div className="relative">
                  <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 relative">
                    <Bell size={20} />
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <h3 className="font-semibold">Notifications</h3>
                      </div>
                      {notifications.map(n => (
                        <div key={n.id} className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${!n.read ? 'bg-indigo-50' : ''}`}>
                          <p className="text-sm font-medium">{n.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{n.time}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Profile */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-linear-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {userName.charAt(0)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all hover:scale-105">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                    </div>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
                  </div>
                  <h3 className="text-gray-600 font-medium">{stat.title}</h3>
                  <p className="text-sm text-gray-500 mt-2">{stat.trend}</p>
                </div>
              );
            })}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Courses */}
            <div className="lg:col-span-2 space-y-6">
              {/* My Courses */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Courses</h2>
                    <p className="text-sm text-gray-500 mt-1">Continue learning from where you left off</p>
                  </div>
                  <button className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                    View All <ChevronRight size={16} />
                  </button>
                </div>

                <div className="space-y-4">
                  {courses.map((course) => (
                    <div key={course.id} className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 hover:border-indigo-300 transition-colors cursor-pointer">
                      <div className="flex gap-4">
                        <img src={course.thumbnail} alt={course.name} className="w-24 h-20 rounded-lg object-cover" />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">{course.name}</h3>
                              <p className="text-sm text-gray-500 mt-1">{course.instructor}</p>
                              <div className="flex items-center gap-3 mt-2">
                                <span className="text-xs text-gray-500">Level: {course.level}</span>
                                <span className="text-xs text-yellow-500 flex items-center gap-1">
                                  <Star size={12} fill="currentColor" /> {course.rating}
                                </span>
                              </div>
                            </div>
                            <span className="text-xs font-medium px-3 py-1 rounded-full bg-indigo-50 text-indigo-600">
                              {course.progress}% Complete
                            </span>
                          </div>
                          <div className="mt-3">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-linear-to-r from-indigo-600 to-purple-600 h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Chart */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Learning Activity</h3>
                <div className="h-48 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-200">
                  <div className="text-center">
                    <BarChart3 className="h-8 w-8 text-gray-400 mx-auto" />
                    <p className="text-sm text-gray-500 mt-2">Your activity chart will appear here</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Assignments */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Upcoming Tasks</h3>
                <div className="space-y-3">
                  {assignments.filter(a => a.status === 'pending').map((assignment) => (
                    <div key={assignment.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-indigo-300 transition-colors">
                      <div className={`p-2 rounded-lg ${getPriorityBadge(assignment.priority)} bg-opacity-20`}>
                        <FileText size={16} className={getPriorityBadge(assignment.priority).split(' ')[1]} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{assignment.title}</p>
                        <p className="text-xs text-gray-500">{assignment.course}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityBadge(assignment.priority)}`}>
                            {assignment.priority}
                          </span>
                          <span className="text-xs text-gray-400">Due {assignment.due}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 text-center text-indigo-600 hover:text-indigo-700 text-sm font-medium py-2 hover:bg-indigo-50 rounded-lg">
                  View All Assignments
                </button>
              </div>

              {/* Upcoming Events */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Upcoming Events</h3>
                {events.map((event) => (
                  <div key={event.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl mb-2">
                    <div className={`p-2 rounded-lg ${event.type === 'live' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                      {event.type === 'live' ? <Video size={16} /> : <Clock size={16} />}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{event.title}</p>
                      <p className="text-xs text-gray-500">{event.date} at {event.time}</p>
                      <p className="text-xs text-gray-400 mt-1">{event.course}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Achievements */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Achievements</h3>
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg mb-2">
                    <div className="w-10 h-10 bg-linear-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center text-xl">
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{achievement.title}</p>
                      <p className="text-xs text-gray-500">{achievement.description}</p>
                      {achievement.progress && (
                        <div className="mt-1">
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div className="bg-linear-to-r from-yellow-500 to-orange-500 h-1 rounded-full" style={{ width: `${achievement.progress}%` }}></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="bg-linear-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-lg p-6 text-white">
                <h3 className="font-bold text-lg mb-2">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl p-3 text-center">
                    <Video size={20} className="mx-auto mb-1" />
                    <span className="text-xs">Join Live</span>
                  </button>
                  <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl p-3 text-center">
                    <FileText size={20} className="mx-auto mb-1" />
                    <span className="text-xs">Submit Work</span>
                  </button>
                  <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl p-3 text-center">
                    <MessageCircle size={20} className="mx-auto mb-1" />
                    <span className="text-xs">Message</span>
                  </button>
                  <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl p-3 text-center">
                    <Download size={20} className="mx-auto mb-1" />
                    <span className="text-xs">Resources</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}