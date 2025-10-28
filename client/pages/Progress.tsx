import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  Award,
} from "lucide-react";

export default function Progress() {
  const navigate = useNavigate();
  const [dateRange] = useState("this-month");

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Total Hours
                </p>
                <p className="text-3xl font-bold text-blue-600 mt-2">12.5h</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-600 opacity-50" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">3/6</p>
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
                <p className="text-3xl font-bold text-green-600 mt-2">85%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600 opacity-50" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Current Streak
                </p>
                <p className="text-3xl font-bold text-orange-600 mt-2">
                  7 days
                </p>
              </div>
              <Calendar className="w-8 h-8 text-orange-600 opacity-50" />
            </div>
          </Card>
        </div>

        {/* Placeholder Content */}
        <Card className="p-12 text-center">
          <div className="inline-block p-4 bg-slate-100 rounded-full mb-4">
            <BarChart3 className="w-8 h-8 text-slate-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Progress Details Coming Soon
          </h2>
          <p className="text-slate-600 max-w-md mx-auto mb-6">
            This section will include detailed progress charts, learning
            calendar, and performance analytics. Complete more lessons to see
            your growth!
          </p>
          <Button
            onClick={() => navigate("/dashboard")}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            Continue Learning
          </Button>
        </Card>
      </div>
    </div>
  );
}
