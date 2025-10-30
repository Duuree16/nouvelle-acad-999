import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { ArrowLeft, BarChart3, TrendingUp, Award } from "lucide-react";

const LESSON_DETAILS: Record<
  string,
  { title: string; category: string; duration: number }
> = {
  "1": {
    title: "Everyday Greetings and Introductions",
    category: "A2",
    duration: 45,
  },
  "2": {
    title: "Describing People and Places",
    category: "B1",
    duration: 60,
  },
  "3": {
    title: "Complex Sentence Structures",
    category: "B2",
    duration: 75,
  },
  "4": {
    title: "Family and Daily Routines",
    category: "A2",
    duration: 55,
  },
  "5": {
    title: "Travel and Holiday Conversations",
    category: "B1",
    duration: 65,
  },
  "6": {
    title: "Business and Professional Communication",
    category: "B2",
    duration: 50,
  },
};

export default function Progress() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const completedLessons = user
    ? Object.entries(user.lessons)
        .filter(([_, lesson]) => lesson.completed)
        .map(([lessonId, lesson]) => ({
          lessonId,
          ...lesson,
          lessonDetails: LESSON_DETAILS[lessonId],
        }))
        .sort(
          (a, b) =>
            new Date(b.completedAt || "").getTime() -
            new Date(a.completedAt || "").getTime(),
        )
    : [];

  const totalHours =
    completedLessons.length > 0
      ? Math.round(
          (completedLessons.reduce(
            (sum, l) => sum + (l.lessonDetails?.duration || 0),
            0,
          ) /
            60) *
            10,
        ) / 10
      : 0;

  const averageScore =
    completedLessons.length > 0
      ? Math.round(
          completedLessons.reduce((sum, l) => sum + l.score, 0) /
            completedLessons.length,
        )
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <Button
          onClick={() => navigate("/dashboard")}
          variant="outline"
          className="gap-2 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Your Progress
          </h1>
          <p className="text-slate-600">
            Track your learning journey and achievements
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Total Hours
                </p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {totalHours}h
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-600 opacity-50" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {completedLessons.length}
                </p>
              </div>
              <Award className="w-8 h-8 text-purple-600 opacity-50" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Average Score
                </p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {averageScore}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600 opacity-50" />
            </div>
          </Card>
        </div>

        {/* Completed Lessons */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Completed Lessons
          </h2>

          {completedLessons.length > 0 ? (
            <div className="space-y-4">
              {completedLessons.map((lesson) => (
                <Card
                  key={lesson.lessonId}
                  className="p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                          {lesson.lessonDetails?.category}
                        </span>
                        <span className="text-xs text-slate-500">
                          {lesson.lessonDetails?.duration} min
                        </span>
                        <span className="text-xs text-slate-500">
                          Completed{" "}
                          {new Date(
                            lesson.completedAt || "",
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        {lesson.lessonDetails?.title}
                      </h3>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-600">
                        {lesson.score}%
                      </div>
                      <p className="text-sm text-slate-600">Your Score</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <div className="inline-block p-4 bg-slate-100 rounded-full mb-4">
                <BarChart3 className="w-8 h-8 text-slate-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                No Lessons Completed Yet
              </h3>
              <p className="text-slate-600 max-w-md mx-auto mb-6">
                Complete lessons from your dashboard to see your progress here.
              </p>
              <Button
                onClick={() => navigate("/dashboard")}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                Start Learning
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
