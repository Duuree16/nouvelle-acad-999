import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Play, Calendar, LogOut, Menu, X } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number;
  completed: boolean;
  progress: number;
  thumbnail: string;
  category: string;
}

interface LiveSession {
  id: string;
  title: string;
  startTime: string;
  instructor: string;
  participants: number;
  zoomLink: string;
}

const MOCK_LESSONS: Lesson[] = [
  {
    id: "1",
    title: "Everyday Greetings and Introductions",
    description:
      "Learn basic greetings, how to introduce yourself, and common social phrases",
    duration: 45,
    completed: true,
    progress: 100,
    thumbnail: "bg-gradient-to-br from-blue-400 to-blue-600",
    category: "A2",
  },
  {
    id: "2",
    title: "Describing People and Places",
    description:
      "Master vocabulary and grammar for describing appearances, personalities, and locations",
    duration: 60,
    completed: false,
    progress: 60,
    thumbnail: "bg-gradient-to-br from-purple-400 to-pink-600",
    category: "B1",
  },
  {
    id: "3",
    title: "Complex Sentence Structures",
    description:
      "Explore advanced grammar including passive voice, conditionals, and subordinate clauses",
    duration: 75,
    completed: false,
    progress: 30,
    thumbnail: "bg-gradient-to-br from-cyan-400 to-blue-600",
    category: "B2",
  },
  {
    id: "4",
    title: "Family and Daily Routines",
    description:
      "Learn vocabulary and expressions for family relationships and daily activities",
    duration: 55,
    completed: false,
    progress: 0,
    thumbnail: "bg-gradient-to-br from-green-400 to-teal-600",
    category: "A2",
  },
  {
    id: "5",
    title: "Travel and Holiday Conversations",
    description:
      "Develop skills for discussing travel plans, booking accommodations, and navigation",
    duration: 65,
    completed: false,
    progress: 0,
    thumbnail: "bg-gradient-to-br from-orange-400 to-red-600",
    category: "B1",
  },
  {
    id: "6",
    title: "Business and Professional Communication",
    description:
      "Master formal language for business meetings, presentations, and professional correspondence",
    duration: 50,
    completed: false,
    progress: 0,
    thumbnail: "bg-gradient-to-br from-red-400 to-pink-600",
    category: "B2",
  },
];

const MOCK_SESSIONS: LiveSession[] = [
  {
    id: "1",
    title: "React Office Hours - Q&A Session",
    startTime: "Today at 3:00 PM",
    instructor: "Sarah Chen",
    participants: 24,
    zoomLink: "https://zoom.us",
  },
  {
    id: "2",
    title: "TypeScript Advanced Patterns Workshop",
    startTime: "Tomorrow at 10:00 AM",
    instructor: "John Developer",
    participants: 18,
    zoomLink: "https://zoom.us",
  },
];

export default function Dashboard() {
  const { user, logout, getLessonProgress } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredLessons = activeCategory
    ? MOCK_LESSONS.filter((lesson) => lesson.category === activeCategory)
    : MOCK_LESSONS;

  const completedCount = user
    ? Object.values(user.lessons).filter((l) => l.completed).length
    : 0;
  const completedLessons = user ? Object.values(user.lessons).filter((l) => l.completed) : [];
  const averageScore = completedLessons.length > 0
    ? Math.round(
        completedLessons.reduce((sum, l) => sum + l.score, 0) / completedLessons.length,
      )
    : 0;

  const categories = [...new Set(MOCK_LESSONS.map((l) => l.category))];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-2 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">NOUVELLE ACADEMY</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-slate-600 hover:text-green-600 font-medium transition"
            >
              Home
            </button>
            <button
              onClick={() => navigate("/progress")}
              className="text-slate-600 hover:text-green-600 font-medium transition"
            >
              Progress
            </button>
            <button
              onClick={() => navigate("/sessions")}
              className="text-slate-600 hover:text-green-600 font-medium transition"
            >
              Live Sessions
            </button>
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-3 pr-4 border-r border-slate-200">
              {user?.avatar && (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <div className="text-sm">
                <p className="font-semibold text-slate-900">{user?.name}</p>
                <p className="text-slate-500 text-xs">{user?.email}</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <div className="px-4 py-4 space-y-3">
              <button
                onClick={() => {
                  navigate("/dashboard");
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg"
              >
                Home
              </button>
              <button
                onClick={() => {
                  navigate("/progress");
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg"
              >
                Progress
              </button>
              <button
                onClick={() => {
                  navigate("/sessions");
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg"
              >
                Live Sessions
              </button>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="w-full gap-2 mt-4"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Welcome back, {user?.name}! 👋
          </h2>
          <p className="text-slate-600">Continue your learning journey</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Completed Lessons
                </p>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {completedCount}
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  of {MOCK_LESSONS.length} lessons
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-purple-600 opacity-50" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Average Score
                </p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {averageScore}%
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  Across all lessons
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-600 opacity-20 flex items-center justify-center">
                <span className="text-emerald-600 font-bold">✓</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-lime-50 to-lime-100 border-lime-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Live Sessions
                </p>
                <p className="text-3xl font-bold text-lime-600 mt-2">
                  {MOCK_SESSIONS.length}
                </p>
                <p className="text-sm text-slate-600 mt-1">Coming up</p>
              </div>
              <Calendar className="w-8 h-8 text-lime-600 opacity-50" />
            </div>
          </Card>
        </div>

        {/* Live Sessions */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">
                Upcoming Live Sessions
              </h3>
              <p className="text-slate-600 text-sm mt-1">
                Join interactive learning sessions with instructors
              </p>
            </div>
            <Button
              onClick={() => navigate("/sessions")}
              variant="outline"
              className="hidden sm:flex"
            >
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_SESSIONS.map((session) => (
              <Card
                key={session.id}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                      <Play className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">
                        {session.title}
                      </h4>
                      <p className="text-sm text-slate-600">
                        {session.instructor}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 mb-4 text-sm text-slate-600">
                  <p>🕐 {session.startTime}</p>
                  <p>👥 {session.participants} participants</p>
                </div>
                <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                  Join Session
                </Button>
              </Card>
            ))}
          </div>

          <Button
            onClick={() => navigate("/sessions")}
            variant="outline"
            className="w-full sm:hidden mt-4"
          >
            View All Sessions
          </Button>
        </div>

        {/* Lessons Section */}
        <div>
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Your Lessons
            </h3>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-4 py-2 rounded-full font-medium transition ${
                  activeCategory === null
                    ? "bg-green-600 text-white"
                    : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                }`}
              >
                All Lessons
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full font-medium transition ${
                    activeCategory === category
                      ? "bg-green-600 text-white"
                      : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Lessons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson) => (
              <Card
                key={lesson.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => navigate(`/lesson/${lesson.id}`)}
              >
                <div
                  className={`${lesson.thumbnail} h-40 flex items-center justify-center relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                  {lesson.completed && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full p-2">
                      <span className="text-sm font-bold">✓</span>
                    </div>
                  )}
                  <Play className="w-12 h-12 text-white opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      {lesson.category}
                    </span>
                    <span className="text-xs text-slate-500">
                      {lesson.duration} min
                    </span>
                  </div>

                  <h4 className="font-semibold text-slate-900 mb-2 line-clamp-2">
                    {lesson.title}
                  </h4>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {lesson.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Progress</span>
                      {user?.lessons[lesson.id] ? (
                        <span className="font-semibold text-slate-900">{user.lessons[lesson.id].score}%</span>
                      ) : (
                        <span className="font-semibold text-slate-900">0%</span>
                      )}
                    </div>
                    <Progress value={user?.lessons[lesson.id]?.score || 0} className="h-2" />
                  </div>

                  <Button
                    className="w-full mt-4 bg-green-600 hover:bg-green-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/lesson/${lesson.id}`);
                    }}
                  >
                    {user?.lessons[lesson.id]?.completed ? "Review Lesson" : "Start Lesson"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
