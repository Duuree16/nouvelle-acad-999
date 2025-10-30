import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Header } from "@/components/Header";
import { VideoPlayer } from "@/components/VideoPlayer";
import { ArrowLeft, Check, X } from "lucide-react";

interface Question {
  id: string;
  type: "multiple-choice" | "fill-in-blank";
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
  "1": {
    id: "1",
    title: "Everyday Greetings and Introductions Quiz",
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        question: 'What is the correct response to "How are you?"',
        options: [
          "I am fine, thank you",
          "Yes, please",
          "No, thank you",
          "My name is John",
        ],
        correctAnswer: "I am fine, thank you",
      },
      {
        id: "q2",
        type: "fill-in-blank",
        question: "My name ________ Sarah, and I am from London.",
        correctAnswer: "is",
      },
      {
        id: "q3",
        type: "multiple-choice",
        question: "Which is a polite way to meet someone for the first time?",
        options: [
          "Nice to meet you",
          "What do you want?",
          "Go away",
          "I don't like you",
        ],
        correctAnswer: "Nice to meet you",
      },
      {
        id: "q4",
        type: "fill-in-blank",
        question: 'When leaving, you say "See you ________!"',
        correctAnswer: "later",
      },
    ],
  },
  "2": {
    id: "2",
    title: "Describing People and Places Quiz",
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        question: "Which word describes a tall building?",
        options: ["High", "Tall", "Long", "Big"],
        correctAnswer: "Tall",
      },
      {
        id: "q2",
        type: "fill-in-blank",
        question: "She has ________ blue eyes and dark hair.",
        correctAnswer: "beautiful",
      },
      {
        id: "q3",
        type: "multiple-choice",
        question: "How do you describe a friendly person?",
        options: [
          "Kind and approachable",
          "Angry and upset",
          "Tired and lazy",
          "Worried and anxious",
        ],
        correctAnswer: "Kind and approachable",
      },
      {
        id: "q4",
        type: "fill-in-blank",
        question: "The city is very ________ with many parks and museums.",
        correctAnswer: "beautiful",
      },
    ],
  },
  "3": {
    id: "3",
    title: "Complex Sentence Structures Quiz",
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        question: "Which sentence uses the passive voice correctly?",
        options: [
          "The book was written by the author",
          "The author was writing the book",
          "The book writing was done",
          "Writing was the book done",
        ],
        correctAnswer: "The book was written by the author",
      },
      {
        id: "q2",
        type: "fill-in-blank",
        question: "If I ________ the exam, I would be very happy.",
        correctAnswer: "passed",
      },
      {
        id: "q3",
        type: "multiple-choice",
        question:
          "Complete: Although she was tired, she _________ to the party.",
        options: ["went", "go", "going", "gone"],
        correctAnswer: "went",
      },
      {
        id: "q4",
        type: "fill-in-blank",
        question:
          "He can speak French, Spanish, and German ________ he is multilingual.",
        correctAnswer: "because",
      },
    ],
  },
  "4": {
    id: "4",
    title: "Family and Daily Routines Quiz",
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        question: "What time do you usually wake up?",
        options: [
          "In the morning at 7 AM",
          "After lunch",
          "At midnight",
          "During sunset",
        ],
        correctAnswer: "In the morning at 7 AM",
      },
      {
        id: "q2",
        type: "fill-in-blank",
        question: "My mother is the ________ of my father.",
        correctAnswer: "wife",
      },
      {
        id: "q3",
        type: "multiple-choice",
        question: "What is a typical morning routine?",
        options: [
          "Wake up, shower, eat breakfast, go to work",
          "Sleep all day",
          "Watch TV all morning",
          "Play sports all day",
        ],
        correctAnswer: "Wake up, shower, eat breakfast, go to work",
      },
      {
        id: "q4",
        type: "fill-in-blank",
        question: "I usually ________ dinner with my family at 6 PM.",
        correctAnswer: "eat",
      },
    ],
  },
  "5": {
    id: "5",
    title: "Travel and Holiday Conversations Quiz",
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        question: "How do you ask for a hotel room?",
        options: [
          "I would like to book a room, please",
          "Give me a room",
          "Room now",
          "Where is the room?",
        ],
        correctAnswer: "I would like to book a room, please",
      },
      {
        id: "q2",
        type: "fill-in-blank",
        question: "We are planning to ________ to Paris next summer.",
        correctAnswer: "travel",
      },
      {
        id: "q3",
        type: "multiple-choice",
        question: "What information do you need when booking a flight?",
        options: [
          "Departure date, destination, and passenger details",
          "Your favorite color",
          "Your shoe size",
          "Your birthday month",
        ],
        correctAnswer: "Departure date, destination, and passenger details",
      },
      {
        id: "q4",
        type: "fill-in-blank",
        question:
          "The beach is a popular ________ destination for summer holidays.",
        correctAnswer: "vacation",
      },
    ],
  },
  "6": {
    id: "6",
    title: "Business and Professional Communication Quiz",
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        question: "How do you formally greet a business colleague?",
        options: [
          "Good morning, Mr. Smith",
          "Hey, what's up?",
          "Hello buddy",
          "Yo, how you doing?",
        ],
        correctAnswer: "Good morning, Mr. Smith",
      },
      {
        id: "q2",
        type: "fill-in-blank",
        question: "Could you please send me the ________ of the meeting?",
        correctAnswer: "minutes",
      },
      {
        id: "q3",
        type: "multiple-choice",
        question: "Which phrase is appropriate for a formal email?",
        options: [
          "I look forward to hearing from you",
          "OK thanks",
          "Whatever",
          "Just send it",
        ],
        correctAnswer: "I look forward to hearing from you",
      },
      {
        id: "q4",
        type: "fill-in-blank",
        question:
          "In a presentation, you should ________ your main points clearly.",
        correctAnswer: "explain",
      },
    ],
  },
};

const LESSON_DETAILS: Record<
  string,
  {
    title: string;
    category: string;
    duration: number;
    videoUrl: string;
    description: string;
  }
> = {
  "1": {
    title: "Everyday Greetings and Introductions",
    category: "A2",
    duration: 45,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description:
      "Master basic greetings, introductions, and common social phrases. Learn how to confidently meet new people and start conversations in English.",
  },
  "2": {
    title: "Describing People and Places",
    category: "B1",
    duration: 60,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description:
      "Expand your vocabulary for describing appearances, personalities, and locations. Develop skills to paint vivid pictures with words.",
  },
  "3": {
    title: "Complex Sentence Structures",
    category: "B2",
    duration: 75,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description:
      "Master advanced grammar including passive voice, conditionals, and subordinate clauses. Speak and write with sophisticated sentence construction.",
  },
  "4": {
    title: "Family and Daily Routines",
    category: "A2",
    duration: 55,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description:
      "Learn vocabulary and expressions for family relationships and everyday activities. Describe your daily life in English with confidence.",
  },
  "5": {
    title: "Travel and Holiday Conversations",
    category: "B1",
    duration: 65,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description:
      "Develop practical communication skills for travel situations. Book accommodations, ask for directions, and navigate new places.",
  },
  "6": {
    title: "Business and Professional Communication",
    category: "B2",
    duration: 50,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description:
      "Master formal language for business meetings, presentations, and professional correspondence. Excel in corporate English communication.",
  },
};

export default function LessonDetail() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { updateLessonProgress } = useAuth();
  const [stage, setStage] = useState<"quiz" | "results">("quiz");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  if (!lessonId || !LESSON_QUIZZES[lessonId]) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={() => navigate("/dashboard")}
            variant="outline"
            className="gap-2 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900">
              Lesson not found
            </h2>
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
    quiz.questions.forEach((q) => {
      const userAnswer = answers[q.id]?.trim().toLowerCase() || "";
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
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmitQuiz = () => {
    if (allAnswered) {
      const finalScore = calculateScore();
      updateLessonProgress(lessonId!, finalScore, finalScore >= 50);
      setQuizSubmitted(true);
      setStage("results");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <Button
          onClick={() => navigate("/dashboard")}
          variant="outline"
          className="gap-2 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        {/* Lesson Info */}
        <div className="mb-8">
          <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium mb-2">
            {lesson.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            {lesson.title}
          </h1>
          <p className="text-slate-600">
            {lesson.duration} minutes • {totalQuestions} questions
          </p>
        </div>

        {/* Video Player */}
        <Card className="p-6 mb-8">
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
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
        </Card>

        {/* Stage Indicator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-green-600 text-white">
            <span className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center text-sm">
              1
            </span>
            Test Your Knowledge
          </div>
        </div>

        {/* Quiz Stage */}
        {stage === "quiz" && !quizSubmitted && (
          <Card className="p-8 mb-8">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-slate-900">
                  Quiz: {quiz.title}
                </h2>
                <span className="text-sm text-slate-600">
                  {answeredCount} / {totalQuestions} answered
                </span>
              </div>
              <Progress value={(answeredCount / totalQuestions) * 100} />
            </div>

            <div className="space-y-8">
              {quiz.questions.map((question, index) => (
                <div
                  key={question.id}
                  className="pb-8 border-b border-slate-200 last:border-b-0"
                >
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    {index + 1}. {question.question}
                  </h3>

                  {question.type === "multiple-choice" ? (
                    <div className="space-y-3">
                      {question.options?.map((option) => (
                        <label
                          key={option}
                          className="flex items-center p-4 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-purple-300 hover:bg-purple-50 transition"
                        >
                          <input
                            type="radio"
                            name={question.id}
                            value={option}
                            checked={answers[question.id] === option}
                            onChange={(e) =>
                              handleAnswerChange(question.id, e.target.value)
                            }
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
                        value={answers[question.id] || ""}
                        onChange={(e) =>
                          handleAnswerChange(question.id, e.target.value)
                        }
                        className="h-12"
                      />
                      <p className="text-sm text-slate-500 mt-2">
                        Tip: Answer should be "{question.correctAnswer}"
                      </p>
                    </div>
                  )}

                  {answers[question.id] && (
                    <div className="mt-3 text-sm text-slate-600">
                      Your answer:{" "}
                      <span className="font-semibold text-slate-900">
                        {answers[question.id]}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Button
                onClick={handleSubmitQuiz}
                disabled={!allAnswered}
                className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50"
              >
                Submit Quiz
              </Button>
            </div>
          </Card>
        )}

        {/* Results Stage */}
        {stage === "results" && quizSubmitted && (
          <Card
            className={`p-8 mb-8 border-2 ${passed ? "border-green-200 bg-green-50" : "border-orange-200 bg-orange-50"}`}
          >
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

              <h2
                className={`text-3xl font-bold mb-2 ${passed ? "text-green-700" : "text-orange-700"}`}
              >
                {passed ? "Excellent! Lesson Completed!" : "Quiz Complete"}
              </h2>

              <p
                className={`text-lg font-semibold mb-2 ${passed ? "text-green-700" : "text-orange-700"}`}
              >
                Your Score: {score}%
              </p>

              {!passed && (
                <p className="text-slate-700">
                  You need to score 100% to complete the lesson. Please review
                  and try again.
                </p>
              )}
            </div>

            {/* Question Review */}
            <div className="space-y-6 mb-8">
              {quiz.questions.map((question, index) => {
                const userAnswer =
                  answers[question.id]?.trim().toLowerCase() || "";
                const correctAnswer = question.correctAnswer
                  .trim()
                  .toLowerCase();
                const isCorrect = userAnswer === correctAnswer;

                return (
                  <div
                    key={question.id}
                    className={`p-4 rounded-lg border-2 ${
                      isCorrect
                        ? "border-green-200 bg-green-50"
                        : "border-red-200 bg-red-50"
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
                        <p
                          className={`text-sm mb-1 ${isCorrect ? "text-green-700" : "text-red-700"}`}
                        >
                          Your answer: {answers[question.id] || "(No answer)"}
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
                    setStage("quiz");
                  }}
                  className="flex-1 h-12 bg-orange-600 hover:bg-orange-700"
                >
                  Try Again
                </Button>
              )}
              <Button
                onClick={() => navigate("/dashboard")}
                variant={passed ? "default" : "outline"}
                className={`flex-1 h-12 ${passed ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700" : ""}`}
              >
                Back to Dashboard
              </Button>
              {passed && (
                <Button
                  onClick={() => navigate("/progress")}
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
