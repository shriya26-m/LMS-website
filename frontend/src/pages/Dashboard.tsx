// // src/pages/Dashboard.tsx
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { 
//   BookOpen, 
//   Users, 
//   Calendar, 
//   Award, 
//   TrendingUp,
//   LogOut,
//   Menu,
//   X,
//   ChevronRight,
//   Bell,
//   Settings,
//   Home,
//   BookMarked,
//   CheckSquare,
//   Clock,
//   Video,
//   FileText,
//   MessageCircle,
//   Star,
//   BarChart3,
//   GraduationCap,
//   UserCheck,
//   AlertCircle
// } from "lucide-react";

// // Define proper types
// interface Course {
//   id: number;
//   name: string;
//   progress: number;
//   instructor: string;
//   dueDate: string;
//   thumbnail?: string;
// }

// interface StudentAssignment {
//   id: number;
//   title: string;
//   course: string;
//   due: string;
//   priority: 'High' | 'Medium' | 'Low';
//   status?: 'pending' | 'submitted' | 'graded';
// }

// interface InstructorGradingItem {
//   id: number;
//   student: string;
//   course: string;
//   submitted: string;
//   priority: 'urgent' | 'normal' | 'overdue';
// }

// interface InstructorCourse {
//   id: number;
//   name: string;
//   students: number;
//   progress: number;
//   rating: number;
//   lastActive: string;
// }

// interface Notification {
//   id: number;
//   message: string;
//   time: string;
//   read: boolean;
//   type: 'info' | 'success' | 'warning' | 'grade';
// }

// interface StatItem {
//   title: string;
//   value: string;
//   icon: React.ElementType;
//   color: string;
//   trend: string;
//   change: string;
// }

// export default function Dashboard() {
//   const navigate = useNavigate();
//   const [userName, setUserName] = useState("");
//   const [userEmail, setUserEmail] = useState("");
//   const [userRole, setUserRole] = useState<"student" | "instructor">("student");
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [activeTab, setActiveTab] = useState("overview");

//   useEffect(() => {
//     // Get user data from localStorage
//     const storedName = localStorage.getItem("name");
//     const storedEmail = localStorage.getItem("email");
//     const storedRole = localStorage.getItem("role") as "student" | "instructor";
    
//     if (storedName && storedRole) {
//       setUserName(storedName);
//       setUserEmail(storedEmail || "");
//       setUserRole(storedRole);
//     } else {
//       navigate("/dashboard");
//     }

//     // Update time every minute
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 60000);

//     return () => clearInterval(timer);
//   }, [navigate]);

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/");
//   };

//   const formatDate = (date: Date) => {
//     return date.toLocaleDateString('en-US', { 
//       weekday: 'long', 
//       year: 'numeric', 
//       month: 'long', 
//       day: 'numeric' 
//     });
//   };

//   const formatTime = (date: Date) => {
//     return date.toLocaleTimeString('en-US', { 
//       hour: '2-digit', 
//       minute: '2-digit' 
//     });
//   };

//   // Student-specific data
//   const studentStats: StatItem[] = [
//     { title: "Enrolled Courses", value: "6", icon: BookOpen, color: "bg-blue-500", trend: "+2 this month", change: "+2" },
//     { title: "Completed Courses", value: "12", icon: Award, color: "bg-green-500", trend: "3 this week", change: "+3" },
//     { title: "In Progress", value: "4", icon: TrendingUp, color: "bg-purple-500", trend: "67% average", change: "67%" },
//     { title: "Assignments", value: "8", icon: CheckSquare, color: "bg-orange-500", trend: "2 due soon", change: "2" },
//   ];

//   // Instructor-specific data
//   const instructorStats: StatItem[] = [
//     { title: "Total Courses", value: "8", icon: BookOpen, color: "bg-blue-500", trend: "3 active this month", change: "+3" },
//     { title: "Total Students", value: "156", icon: Users, color: "bg-green-500", trend: "+12 this week", change: "+12" },
//     { title: "Pending Reviews", value: "23", icon: FileText, color: "bg-purple-500", trend: "8 urgent", change: "8" },
//     { title: "Average Rating", value: "4.8", icon: Star, color: "bg-yellow-500", trend: "From 156 reviews", change: "4.8" },
//   ];

//   const recentCourses: Course[] = [
//     { id: 1, name: "Web Development Bootcamp", progress: 75, instructor: "John Doe", dueDate: "Dec 15, 2024", thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80" },
//     { id: 2, name: "Data Science Fundamentals", progress: 45, instructor: "Jane Smith", dueDate: "Dec 20, 2024", thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80" },
//     { id: 3, name: "UI/UX Design Masterclass", progress: 30, instructor: "Mike Johnson", dueDate: "Jan 10, 2025", thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80" },
//   ];

//   const instructorCourses: InstructorCourse[] = [
//     { id: 1, name: "Advanced React", students: 45, progress: 65, rating: 4.9, lastActive: "2 hours ago" },
//     { id: 2, name: "Python for Beginners", students: 78, progress: 82, rating: 4.7, lastActive: "1 day ago" },
//     { id: 3, name: "Database Design", students: 33, progress: 41, rating: 4.8, lastActive: "3 hours ago" },
//   ];

//   const upcomingAssignments: StudentAssignment[] = [
//     { id: 1, title: "React Project", course: "Web Development", due: "Tomorrow", priority: "High", status: "pending" },
//     { id: 2, title: "Data Analysis Report", course: "Data Science", due: "Dec 18, 2024", priority: "Medium", status: "pending" },
//     { id: 3, title: "Wireframe Design", course: "UI/UX Design", due: "Dec 22, 2024", priority: "Low", status: "submitted" },
//   ];

//   const assignmentsToGrade: InstructorGradingItem[] = [
//     { id: 1, student: "Alex Johnson", course: "Advanced React", submitted: "2 hours ago", priority: "urgent" },
//     { id: 2, student: "Sarah Williams", course: "Python Basics", submitted: "5 hours ago", priority: "normal" },
//     { id: 3, student: "Mike Brown", course: "Database Design", submitted: "1 day ago", priority: "normal" },
//     { id: 4, student: "Emma Davis", course: "Advanced React", submitted: "2 days ago", priority: "overdue" },
//   ];

//   const notifications: Notification[] = [
//     { id: 1, message: "New course material added: React Hooks Deep Dive", time: "2 hours ago", read: false, type: "info" },
//     { id: 2, message: "Assignment graded: Web Project - 95%", time: "1 day ago", read: true, type: "grade" },
//     { id: 3, message: "Reminder: Live session today at 3 PM", time: "2 days ago", read: true, type: "warning" },
//     { id: 4, message: "New student enrolled in your course", time: "3 days ago", read: false, type: "success" },
//   ];

//   const getPriorityColor = (priority: string): string => {
//     switch(priority) {
//       case 'High': return 'bg-red-100 text-red-700';
//       case 'Medium': return 'bg-yellow-100 text-yellow-700';
//       case 'Low': return 'bg-green-100 text-green-700';
//       default: return 'bg-gray-100 text-gray-700';
//     }
//   };

//   const getInstructorPriorityColor = (priority: string): string => {
//     switch(priority) {
//       case 'urgent': return 'bg-red-100 text-red-700';
//       case 'overdue': return 'bg-orange-100 text-orange-700';
//       case 'normal': return 'bg-gray-100 text-gray-700';
//       default: return 'bg-gray-100 text-gray-700';
//     }
//   };

//   const getNotificationIcon = (type: string) => {
//     switch(type) {
//       case 'info': return <Bell className="h-4 w-4 text-blue-500" />;
//       case 'success': return <UserCheck className="h-4 w-4 text-green-500" />;
//       case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
//       case 'grade': return <Star className="h-4 w-4 text-purple-500" />;
//       default: return <Bell className="h-4 w-4 text-gray-500" />;
//     }
//   };

//   // Type guard functions
//   const isInstructorItem = (item: any): item is InstructorGradingItem => {
//     return item && 'student' in item;
//   };

//   const isStudentAssignment = (item: any): item is StudentAssignment => {
//     return item && 'title' in item && !('student' in item);
//   };

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Sidebar */}
//       <div className={`${isSidebarOpen ? 'w-72' : 'w-20'} bg-white shadow-xl transition-all duration-300 ease-in-out flex flex-col border-r border-gray-200`}>
//         {/* Logo and toggle */}
//         <div className="flex items-center justify-between p-5 border-b border-gray-200">
//           {isSidebarOpen && (
//             <div className="flex items-center space-x-2">
//               <GraduationCap className="h-8 w-8 text-indigo-600" />
//               <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//                 LearnHub
//               </span>
//             </div>
//           )}
//           <button 
//             onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//             className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
//           >
//             {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
//           </button>
//         </div>

//         {/* User profile */}
//         <div className="p-4 border-b border-gray-200">
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
//               {userName.charAt(0).toUpperCase()}
//             </div>
//             {isSidebarOpen && (
//               <div className="flex-1">
//                 <p className="font-semibold text-gray-800">{userName}</p>
//                 <p className="text-xs text-gray-500">{userRole === 'instructor' ? '👨‍🏫 Instructor' : '👨‍🎓 Student'}</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 p-4">
//           <div className="space-y-1">
//             {[
//               { icon: Home, label: "Overview", active: activeTab === "overview" },
//               { icon: BookOpen, label: userRole === 'instructor' ? "My Courses" : "My Learning" },
//               { icon: BookMarked, label: "Resources" },
//               { icon: Users, label: userRole === 'instructor' ? "Students" : "Community" },
//               { icon: Calendar, label: "Schedule" },
//               { icon: Award, label: userRole === 'instructor' ? "Analytics" : "Achievements" },
//               { icon: Settings, label: "Settings" },
//             ].map((item, index) => (
//               <button
//                 key={index}
//                 onClick={() => setActiveTab(item.label.toLowerCase())}
//                 className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
//                   item.active 
//                     ? 'bg-indigo-50 text-indigo-600' 
//                     : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
//                 }`}
//               >
//                 <item.icon size={20} />
//                 {isSidebarOpen && <span className="font-medium">{item.label}</span>}
//                 {isSidebarOpen && item.active && <ChevronRight size={16} className="ml-auto" />}
//               </button>
//             ))}
//           </div>
//         </nav>

//         {/* Logout button */}
//         <div className="p-4 border-t border-gray-200">
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
//           >
//             <LogOut size={20} />
//             {isSidebarOpen && <span className="font-medium">Logout</span>}
//           </button>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 overflow-y-auto">
//         {/* Header */}
//         <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
//           <div className="px-8 py-4 flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-800">
//                 Welcome back, {userName}! 👋
//               </h1>
//               <p className="text-gray-500 flex items-center gap-2">
//                 <Calendar size={14} />
//                 {formatDate(currentTime)} • <Clock size={14} /> {formatTime(currentTime)}
//               </p>
//             </div>
            
//             <div className="flex items-center space-x-4">
//               {/* Notifications */}
//               <div className="relative">
//                 <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
//                   <Bell size={20} className="text-gray-600" />
//                   {notifications.filter(n => !n.read).length > 0 && (
//                     <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
//                   )}
//                 </button>
//               </div>
              
//               {/* User menu */}
//               <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
//                 <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
//                   {userName.charAt(0).toUpperCase()}
//                 </div>
//                 <div className="text-left">
//                   <p className="text-sm font-medium text-gray-700">{userName}</p>
//                   <p className="text-xs text-gray-500">{userRole}</p>
//                 </div>
//               </button>
//             </div>
//           </div>
//         </header>

//         {/* Dashboard Content */}
//         <div className="p-8">
//           {/* Stats Grid - Dynamic based on role */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             {(userRole === 'instructor' ? instructorStats : studentStats).map((stat, index) => {
//               const Icon = stat.icon;
//               return (
//                 <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:scale-105 duration-200">
//                   <div className="flex items-center justify-between mb-4">
//                     <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
//                       <Icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
//                     </div>
//                     <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
//                   </div>
//                   <h3 className="text-gray-600 font-medium">{stat.title}</h3>
//                   <div className="flex items-center justify-between mt-2">
//                     <p className="text-sm text-gray-500">{stat.trend}</p>
//                     <span className="text-xs font-medium text-green-600">{stat.change}</span>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Main Grid */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Left Column - Courses/Teaching */}
//             <div className="lg:col-span-2 space-y-6">
//               {/* Recent/Active Courses */}
//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                 <div className="flex items-center justify-between mb-6">
//                   <h2 className="text-xl font-bold text-gray-800">
//                     {userRole === 'instructor' ? 'Active Courses' : 'Recent Courses'}
//                   </h2>
//                   <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1">
//                     View All <ChevronRight size={16} />
//                   </button>
//                 </div>
                
//                 {userRole === 'instructor' ? (
//                   <div className="space-y-4">
//                     {instructorCourses.map((course) => (
//                       <div key={course.id} className="border border-gray-100 rounded-lg p-4 hover:border-indigo-200 transition-colors">
//                         <div className="flex justify-between items-start mb-3">
//                           <div>
//                             <h3 className="font-semibold text-gray-800">{course.name}</h3>
//                             <div className="flex items-center gap-4 mt-1">
//                               <span className="text-sm text-gray-500 flex items-center gap-1">
//                                 <Users size={14} /> {course.students} students
//                               </span>
//                               <span className="text-sm text-gray-500 flex items-center gap-1">
//                                 <Star size={14} className="text-yellow-400" /> {course.rating}
//                               </span>
//                             </div>
//                           </div>
//                           <span className="text-xs text-gray-500">Active {course.lastActive}</span>
//                         </div>
//                         <div className="mt-2">
//                           <div className="flex justify-between text-sm mb-1">
//                             <span className="text-gray-600">Course Progress</span>
//                             <span className="font-medium text-indigo-600">{course.progress}%</span>
//                           </div>
//                           <div className="w-full bg-gray-200 rounded-full h-2">
//                             <div 
//                               className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
//                               style={{ width: `${course.progress}%` }}
//                             ></div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     {recentCourses.map((course) => (
//                       <div key={course.id} className="border border-gray-100 rounded-lg p-4 hover:border-indigo-200 transition-colors">
//                         <div className="flex gap-4">
//                           {course.thumbnail && (
//                             <img src={course.thumbnail} alt={course.name} className="w-16 h-16 rounded-lg object-cover" />
//                           )}
//                           <div className="flex-1">
//                             <div className="flex justify-between items-start">
//                               <div>
//                                 <h3 className="font-semibold text-gray-800">{course.name}</h3>
//                                 <p className="text-sm text-gray-500">Instructor: {course.instructor}</p>
//                               </div>
//                               <span className="text-xs text-gray-500">Due: {course.dueDate}</span>
//                             </div>
//                             <div className="mt-3">
//                               <div className="flex justify-between text-sm mb-1">
//                                 <span className="text-gray-600">Progress</span>
//                                 <span className="font-medium text-indigo-600">{course.progress}%</span>
//                               </div>
//                               <div className="w-full bg-gray-200 rounded-full h-2">
//                                 <div 
//                                   className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
//                                   style={{ width: `${course.progress}%` }}
//                                 ></div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Activity/Performance Chart Placeholder */}
//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                 <h2 className="text-xl font-bold text-gray-800 mb-4">
//                   {userRole === 'instructor' ? 'Teaching Activity' : 'Learning Activity'}
//                 </h2>
//                 <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
//                   <div className="text-center">
//                     <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
//                     <p className="text-gray-500">Activity chart will appear here</p>
//                     <p className="text-sm text-gray-400">Last 30 days performance</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Right Column */}
//             <div className="space-y-6">
//               {/* Tasks/Assignments to Grade */}
//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                 <h2 className="text-xl font-bold text-gray-800 mb-4">
//                   {userRole === 'instructor' ? 'Pending Reviews' : 'Upcoming Tasks'}
//                 </h2>
//                 <div className="space-y-3">
//                   {(userRole === 'instructor' ? assignmentsToGrade : upcomingAssignments).map((item) => (
//                     <div key={item.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:border-indigo-200 transition-colors">
//                       <div className="flex-1">
//                         <h3 className="font-semibold text-gray-800">
//                           {userRole === 'instructor' 
//                             ? (item as InstructorGradingItem).student 
//                             : (item as StudentAssignment).title}
//                         </h3>
//                         <p className="text-sm text-gray-500">
//                           {item.course}
//                         </p>
//                       </div>
//                       <div className="text-right">
//                         {userRole === 'instructor' ? (
//                           <>
//                             <span className={`text-xs px-2 py-1 rounded-full ${
//                               getInstructorPriorityColor((item as InstructorGradingItem).priority)
//                             }`}>
//                               {(item as InstructorGradingItem).priority}
//                             </span>
//                             <p className="text-xs text-gray-500 mt-1">{(item as InstructorGradingItem).submitted}</p>
//                           </>
//                         ) : (
//                           <>
//                             <span className={`text-xs px-2 py-1 rounded-full ${
//                               getPriorityColor((item as StudentAssignment).priority)
//                             }`}>
//                               {(item as StudentAssignment).priority}
//                             </span>
//                             <p className="text-xs text-gray-500 mt-1">{(item as StudentAssignment).due}</p>
//                           </>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 <button className="w-full mt-4 text-center text-indigo-600 hover:text-indigo-700 text-sm font-medium">
//                   View All
//                 </button>
//               </div>

//               {/* Notifications/Updates */}
//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                 <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Updates</h2>
//                 <div className="space-y-3">
//                   {notifications.slice(0, 3).map((notification) => (
//                     <div key={notification.id} className={`flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors ${!notification.read ? 'bg-indigo-50' : ''}`}>
//                       <div className="mt-1">
//                         {getNotificationIcon(notification.type)}
//                       </div>
//                       <div className="flex-1">
//                         <p className="text-sm text-gray-800">{notification.message}</p>
//                         <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
//                       </div>
//                       {!notification.read && (
//                         <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//                 <button className="w-full mt-4 text-center text-indigo-600 hover:text-indigo-700 text-sm font-medium">
//                   View All Notifications
//                 </button>
//               </div>

//               {/* Quick Actions */}
//               <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
//                 <h3 className="font-bold text-lg mb-2">Quick Actions</h3>
//                 <div className="grid grid-cols-2 gap-2 mt-4">
//                   <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-3 text-center transition-all">
//                     <Video size={20} className="mx-auto mb-1" />
//                     <span className="text-xs">Join Live</span>
//                   </button>
//                   <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-3 text-center transition-all">
//                     <FileText size={20} className="mx-auto mb-1" />
//                     <span className="text-xs">Submit Work</span>
//                   </button>
//                   <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-3 text-center transition-all">
//                     <MessageCircle size={20} className="mx-auto mb-1" />
//                     <span className="text-xs">Message</span>
//                   </button>
//                   <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-3 text-center transition-all">
//                     <Calendar size={20} className="mx-auto mb-1" />
//                     <span className="text-xs">Schedule</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import StudentDashboard from '../components/StudentDashboard';
import InstructorDashboard from '../components/InstructorDashboard';

export default function Dashboard() {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<'student' | 'instructor'>('student');

  useEffect(() => {
    if (user?.role) {
      setUserRole(user.role as 'student' | 'instructor');
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole={userRole} />
      <div className="container mx-auto px-4 py-8">
        {userRole === 'student' ? <StudentDashboard /> : <InstructorDashboard />}
      </div>
    </div>
  );
}