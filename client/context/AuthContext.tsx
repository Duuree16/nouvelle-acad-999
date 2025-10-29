import React, { createContext, useState, useContext, ReactNode } from "react";

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  score: number;
  progress: number;
  completedAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  lessons: Record<string, LessonProgress>;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
  updateLessonProgress: (
    lessonId: string,
    score: number,
    completed: boolean,
  ) => void;
  getLessonProgress: (lessonId: string) => LessonProgress | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string) => {
    // Mock authentication - in production, this would call your API
    const mockUser: User = {
      id: "1",
      name: email.split("@")[0],
      email: email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      lessons: {},
    };
    setUser(mockUser);
    localStorage.setItem("user", JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const updateLessonProgress = (
    lessonId: string,
    score: number,
    completed: boolean,
  ) => {
    if (!user) return;

    const updatedUser: User = {
      ...user,
      lessons: {
        ...user.lessons,
        [lessonId]: {
          lessonId,
          completed,
          score,
          progress: completed ? 100 : score || 0,
          completedAt: completed ? new Date().toISOString() : undefined,
        },
      },
    };

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const getLessonProgress = (lessonId: string) => {
    return user?.lessons[lessonId];
  };

  // Check if user exists in localStorage on mount
  React.useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser({
          ...parsed,
          lessons: parsed.lessons || {},
        });
      } catch (error) {
        console.error("Failed to parse saved user:", error);
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        updateLessonProgress,
        getLessonProgress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
