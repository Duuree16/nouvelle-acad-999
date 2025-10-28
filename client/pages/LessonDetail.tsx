import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Check, X } from 'lucide-react';

interface Question {
  id: string;
  type: 'multiple-choice' | 'fill-in-blank';
  question: string;
  options?: string[];
  correctAnswer: string;
  userAnswer?: string;
}

interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

const LESSON_QUIZZES: Record<string, Quiz> = {
  '1': {
    id: '1',
    title: 'Introduction to Web Development Quiz',
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'What does HTML stand for?',
        options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language'],
        correctAnswer: 'Hyper Text Markup Language',
      },
      {
        id: 'q2',
        type: 'fill-in-blank',
        question: 'CSS stands for ________ Sheet.',
        correctAnswer: 'Cascading Style',
      },
      {
        id: 'q3',
        type: 'multiple-choice',
        question: 'Which element is used for the largest heading?',
        options: ['<h6>', '<h1>', '<heading>', '<title>'],
        correctAnswer: '<h1>',
      },
      {
        id: 'q4',
        type: 'fill-in-blank',
        question: 'JavaScript is a ________ language used to add interactivity to web pages.',
        correctAnswer: 'programming',
      },
    ],
  },
  '2': {
    id: '2',
    title: 'React Basics Quiz',
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'What is React?',
        options: ['A JavaScript library for building UIs', 'A CSS framework', 'A server framework', 'A database tool'],
        correctAnswer: 'A JavaScript library for building UIs',
      },
      {
        id: 'q2',
        type: 'fill-in-blank',
        question: 'React components must return a single ________ element.',
        correctAnswer: 'root',
      },
      {
        id: 'q3',
        type: 'multiple-choice',
        question: 'What is the purpose of the useState hook?',
        options: ['To manage state in functional components', 'To fetch data', 'To style components', 'To route pages'],
        correctAnswer: 'To manage state in functional components',
      },
      {
        id: 'q4',
        type: 'fill-in-blank',
        question: 'Props are used to pass data from a ________ component to a child component.',
        correctAnswer: 'parent',
      },
    ],
  },
  '3': {
    id: '3',
    title: 'Advanced TypeScript Patterns Quiz',
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'What is a Generic in TypeScript?',
        options: ['A way to create reusable components with types', 'A type of loop', 'A method to fetch data', 'A styling technique'],
        correctAnswer: 'A way to create reusable components with types',
      },
      {
        id: 'q2',
        type: 'fill-in-blank',
        question: 'The ________ keyword is used to create a new instance of a class.',
        correctAnswer: 'new',
      },
      {
        id: 'q3',
        type: 'multiple-choice',
        question: 'What is an Interface in TypeScript?',
        options: ['A contract that defines the structure of objects', 'A CSS property', 'A DOM element', 'A function definition'],
        correctAnswer: 'A contract that defines the structure of objects',
      },
      {
        id: 'q4',
        type: 'fill-in-blank',
        question: 'Union types are denoted by the ________ operator.',
        correctAnswer: '|',
      },
    ],
  },
};

const LESSON_DETAILS: Record<string, { title: string; category: string; duration: number; videoUrl: string; description: string }> = {
  '1': {
    title: 'Introduction to Web Development',
    category: 'Web Development',
    duration: 45,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Learn the fundamentals of HTML, CSS, and JavaScript. This comprehensive course covers the basics you need to start building websites.',
  },
  '2': {
    title: 'React Basics and Components',
    category: 'Frontend',
    duration: 60,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Master React fundamentals and component architecture. Learn how to build scalable and maintainable React applications.',
  },
  '3': {
    title: 'Advanced TypeScript Patterns',
    category: 'Programming',
    duration: 75,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Explore advanced TypeScript concepts and patterns. Become a TypeScript expert and write type-safe code.',
  },
};

export default function LessonDetail() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const [stage, setStage] = useState<'video' | 'quiz' | 'results'>('video');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  if (!lessonId || !LESSON_QUIZZES[lessonId]) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="gap-2 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900">Lesson not found</h2>
            <p className="text-slate-600 mt-2">This lesson doesn't exist</p>
          </Card>
        </div>
      </div>
    );
  }

  const lesson = LESSON_DETAILS[lessonId];
  const quiz = LESSON_QUIZZES[lessonId];
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = quiz.questions.length;
  const allAnswered = answeredCount === totalQuestions;

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach(q => {
      const userAnswer = answers[q.id]?.trim().toLowerCase() || '';
      const correctAnswer = q.correctAnswer.trim().toLowerCase();
      if (userAnswer === correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / totalQuestions) * 100);
  };

  const score = quizSubmitted ? calculateScore() : 0;
  const passed = score === 100;

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmitQuiz = () => {
    if (allAnswered) {
      setQuizSubmitted(true);
      setStage('results');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <Button
          onClick={() => navigate('/dashboard')}
          variant="outline"
          className="gap-2 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        {/* Lesson Info */}
        <div className="mb-8">
          <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium mb-2">
            {lesson.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{lesson.title}</h1>
          <p className="text-slate-600">{lesson.duration} minutes • {totalQuestions} questions</p>
        </div>

        {/* Stage Indicator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={() => !quizSubmitted && setStage('video')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
              stage === 'video'
                ? 'bg-purple-600 text-white'
                : quizSubmitted ? 'bg-slate-200 text-slate-600' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            }`}
          >
            <span className="w-6 h-6 rounded-full bg-current bg-opacity-30 flex items-center justify-center text-sm">1</span>
            Video
          </button>

          <div className="h-1 w-8 bg-slate-300"></div>

          <button
            onClick={() => stage !== 'video' && !quizSubmitted && setStage('quiz')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
              stage !== 'video' && !quizSubmitted
                ? 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                : stage === 'quiz' || quizSubmitted
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-200 text-slate-600'
            }`}
          >
            <span className="w-6 h-6 rounded-full bg-current bg-opacity-30 flex items-center justify-center text-sm">2</span>
            Quiz
          </button>
        </div>

        {/* Video Stage */}
        {stage === 'video' && (
          <Card className="p-6 mb-8">
            <div className="aspect-video bg-black rounded-lg overflow-hidden mb-6">
              <iframe
                width="100%"
                height="100%"
                src={lesson.videoUrl}
                title={lesson.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-4">About This Lesson</h2>
            <p className="text-slate-600 leading-relaxed mb-6">{lesson.description}</p>

            <Button
              onClick={() => setStage('quiz')}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-12"
            >
              Proceed to Quiz
            </Button>
          </Card>
        )}

        {/* Quiz Stage */}
        {stage === 'quiz' && !quizSubmitted && (
          <Card className="p-8 mb-8">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-slate-900">Quiz: {quiz.title}</h2>
                <span className="text-sm text-slate-600">
                  {answeredCount} / {totalQuestions} answered
                </span>
              </div>
              <Progress value={(answeredCount / totalQuestions) * 100} />
            </div>

            <div className="space-y-8">
              {quiz.questions.map((question, index) => (
                <div key={question.id} className="pb-8 border-b border-slate-200 last:border-b-0">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    {index + 1}. {question.question}
                  </h3>

                  {question.type === 'multiple-choice' ? (
                    <div className="space-y-3">
                      {question.options?.map(option => (
                        <label
                          key={option}
                          className="flex items-center p-4 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-purple-300 hover:bg-purple-50 transition"
                        >
                          <input
                            type="radio"
                            name={question.id}
                            value={option}
                            checked={answers[question.id] === option}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            className="w-4 h-4 text-purple-600"
                          />
                          <span className="ml-3 text-slate-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <Input
                        type="text"
                        placeholder="Type your answer here..."
                        value={answers[question.id] || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className="h-12"
                      />
                      <p className="text-sm text-slate-500 mt-2">
                        Tip: Answer should be "{question.correctAnswer}"
                      </p>
                    </div>
                  )}

                  {answers[question.id] && (
                    <div className="mt-3 text-sm text-slate-600">
                      Your answer: <span className="font-semibold text-slate-900">{answers[question.id]}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex gap-4">
              <Button
                onClick={() => setStage('video')}
                variant="outline"
                className="flex-1 h-12"
              >
                Back to Video
              </Button>
              <Button
                onClick={handleSubmitQuiz}
                disabled={!allAnswered}
                className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50"
              >
                Submit Quiz
              </Button>
            </div>
          </Card>
        )}

        {/* Results Stage */}
        {stage === 'results' && quizSubmitted && (
          <Card className={`p-8 mb-8 border-2 ${passed ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}>
            <div className="text-center mb-8">
              {passed ? (
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-white" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="w-8 h-8 text-white" />
                </div>
              )}

              <h2 className={`text-3xl font-bold mb-2 ${passed ? 'text-green-700' : 'text-orange-700'}`}>
                {passed ? 'Excellent! Lesson Completed!' : 'Quiz Complete'}
              </h2>

              <p className={`text-lg font-semibold mb-2 ${passed ? 'text-green-700' : 'text-orange-700'}`}>
                Your Score: {score}%
              </p>

              {!passed && (
                <p className="text-slate-700">
                  You need to score 100% to complete the lesson. Please review and try again.
                </p>
              )}
            </div>

            {/* Question Review */}
            <div className="space-y-6 mb-8">
              {quiz.questions.map((question, index) => {
                const userAnswer = answers[question.id]?.trim().toLowerCase() || '';
                const correctAnswer = question.correctAnswer.trim().toLowerCase();
                const isCorrect = userAnswer === correctAnswer;

                return (
                  <div
                    key={question.id}
                    className={`p-4 rounded-lg border-2 ${
                      isCorrect
                        ? 'border-green-200 bg-green-50'
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900 mb-2">
                          {index + 1}. {question.question}
                        </p>
                        <p className={`text-sm mb-1 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                          Your answer: {answers[question.id] || '(No answer)'}
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-green-700">
                            Correct answer: {question.correctAnswer}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              {!passed && (
                <Button
                  onClick={() => {
                    setAnswers({});
                    setQuizSubmitted(false);
                    setStage('quiz');
                  }}
                  className="flex-1 h-12 bg-orange-600 hover:bg-orange-700"
                >
                  Try Again
                </Button>
              )}
              <Button
                onClick={() => navigate('/dashboard')}
                variant={passed ? 'default' : 'outline'}
                className={`flex-1 h-12 ${passed ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' : ''}`}
              >
                Back to Dashboard
              </Button>
              {passed && (
                <Button
                  onClick={() => navigate('/progress')}
                  className="flex-1 h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  View Progress
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
