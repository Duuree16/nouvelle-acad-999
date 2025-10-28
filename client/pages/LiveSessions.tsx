import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Play, Calendar, Clock, Users } from 'lucide-react';

interface LiveSession {
  id: string;
  title: string;
  startTime: string;
  instructor: string;
  participants: number;
  status: 'upcoming' | 'live' | 'ended';
  zoomLink: string;
}

const SESSIONS: LiveSession[] = [
  {
    id: '1',
    title: 'React Office Hours - Q&A Session',
    startTime: 'Today at 3:00 PM',
    instructor: 'Sarah Chen',
    participants: 24,
    status: 'upcoming',
    zoomLink: 'https://zoom.us',
  },
  {
    id: '2',
    title: 'TypeScript Advanced Patterns Workshop',
    startTime: 'Tomorrow at 10:00 AM',
    instructor: 'John Developer',
    participants: 18,
    status: 'upcoming',
    zoomLink: 'https://zoom.us',
  },
  {
    id: '3',
    title: 'Web Security Best Practices',
    startTime: 'Friday at 2:00 PM',
    instructor: 'Emma Security',
    participants: 32,
    status: 'upcoming',
    zoomLink: 'https://zoom.us',
  },
  {
    id: '4',
    title: 'Database Design Masterclass',
    startTime: 'Last week',
    instructor: 'Alex Database',
    participants: 28,
    status: 'ended',
    zoomLink: 'https://zoom.us',
  },
];

export default function LiveSessions() {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'live' | 'ended'>('all');

  const filteredSessions = filterStatus === 'all'
    ? SESSIONS
    : SESSIONS.filter(s => s.status === filterStatus);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <Button
          onClick={() => navigate('/dashboard')}
          variant="outline"
          className="gap-2 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Live Sessions</h1>
          <p className="text-slate-600">Join interactive learning sessions with our instructors</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(['all', 'upcoming', 'live', 'ended'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-full font-medium transition capitalize ${
                filterStatus === status
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {status === 'live' ? 'Live Now' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Sessions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSessions.map(session => (
            <Card
              key={session.id}
              className={`p-6 border-2 transition hover:shadow-lg ${
                session.status === 'live'
                  ? 'border-red-300 bg-red-50'
                  : session.status === 'ended'
                    ? 'border-slate-300 bg-slate-50'
                    : 'border-slate-200'
              }`}
            >
              {/* Status Badge */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  {session.status === 'live' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                      LIVE
                    </span>
                  )}
                  {session.status === 'upcoming' && (
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                      UPCOMING
                    </span>
                  )}
                  {session.status === 'ended' && (
                    <span className="inline-block px-3 py-1 bg-slate-200 text-slate-700 text-xs font-bold rounded-full">
                      ENDED
                    </span>
                  )}
                </div>
              </div>

              {/* Title and Instructor */}
              <h3 className="text-lg font-bold text-slate-900 mb-3">{session.title}</h3>

              <div className="space-y-2 mb-6 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{session.startTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{session.participants} participants</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Instructor: {session.instructor}</span>
                </div>
              </div>

              {/* Action Button */}
              <Button
                onClick={() => {
                  if (session.status === 'ended') {
                    navigate('/dashboard');
                  } else {
                    window.open(session.zoomLink, '_blank');
                  }
                }}
                className={`w-full gap-2 ${
                  session.status === 'live'
                    ? 'bg-red-600 hover:bg-red-700'
                    : session.status === 'ended'
                      ? 'bg-slate-600 hover:bg-slate-700'
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                }`}
              >
                <Play className="w-4 h-4" />
                {session.status === 'live'
                  ? 'Join Now'
                  : session.status === 'ended'
                    ? 'Back to Dashboard'
                    : 'Join Session'}
              </Button>
            </Card>
          ))}
        </div>

        {filteredSessions.length === 0 && (
          <Card className="p-12 text-center">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No sessions found</h3>
            <p className="text-slate-600 mb-6">Check back later for more live sessions</p>
            <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
          </Card>
        )}
      </div>
    </div>
  );
}
