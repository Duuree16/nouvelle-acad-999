import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { authAPI, progressAPI, User as APIUser, Progress } from "@/services/api";

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
  phoneNumber?: string;
  avatar?: string;
  lessons: Record<string, LessonProgress>;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (userData: APIUser, token: string) => void;
  logout: () => void;
  updateLessonProgress: (
    lessonId: string,
    score: number,
    completed: boolean,
  ) => Promise<void>;
  loadProgress: () => Promise<void>;
  getLessonProgress: (lessonId: string) => LessonProgress | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const login = (userData: APIUser, authToken: string) => {
    const userWithLessons: User = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      avatar: userData.avatar || undefined,
      lessons: {},
    };

    setUser(userWithLessons);
    setToken(authToken);
    localStorage.setItem("user", JSON.stringify(userWithLessons));
    localStorage.setItem("token", authToken);

    // Load progress after login
    loadProgress();
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const loadProgress = async () => {
    try {
      const response = await progressAPI.getAll();

      // Transform array of progress entries into Record<string, LessonProgress>
      const lessonsRecord: Record<string, LessonProgress> = {};
      response.progress.forEach((entry: Progress) => {
        lessonsRecord[entry.lessonId] = {
          lessonId: entry.lessonId,
          completed: entry.completed,
          score: entry.score,
          progress: entry.progress,
          completedAt: entry.completedAt || undefined,
        };
      });

      // Update user with fetched progress
      setUser((prevUser) => {
        if (!prevUser) return null;
        const updatedUser = {
          ...prevUser,
          lessons: lessonsRecord,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return updatedUser;
      });
    } catch (error) {
      console.error("Failed to load progress:", error);
    }
  };

  const updateLessonProgress = async (
    lessonId: string,
    score: number,
    completed: boolean,
  ) => {
    if (!user) return;

    try {
      // Call API to save progress
      const response = await progressAPI.update({
        lessonId,
        score,
        completed,
        progress: completed ? 100 : score || 0,
      });

      // Update local state with response data
      const updatedUser: User = {
        ...user,
        lessons: {
          ...user.lessons,
          [lessonId]: {
            lessonId: response.progress.lessonId,
            completed: response.progress.completed,
            score: response.progress.score,
            progress: response.progress.progress,
            completedAt: response.progress.completedAt || undefined,
          },
        },
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Failed to save progress:", error);
      throw error; // Re-throw so UI can handle the error
    }
  };

  const getLessonProgress = (lessonId: string) => {
    return user?.lessons[lessonId];
  };

  // Check token validity on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (savedToken) {
        try {
          // Validate token by fetching current user
          const response = await authAPI.getCurrentUser();

          // Parse saved user to get lessons data
          let lessons: Record<string, LessonProgress> = {};
          if (savedUser) {
            try {
              const parsed = JSON.parse(savedUser);
              lessons = parsed.lessons || {};
            } catch (error) {
              console.error("Failed to parse saved user:", error);
            }
          }

          // Set user with API data
          const userWithLessons: User = {
            id: response.user.id,
            name: response.user.name,
            email: response.user.email,
            phoneNumber: response.user.phoneNumber,
            avatar: response.user.avatar || undefined,
            lessons,
          };

          setUser(userWithLessons);
          setToken(savedToken);

          // Load latest progress from server
          await loadProgress();
        } catch (error) {
          console.error("Token validation failed:", error);
          // Clear invalid token
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setToken(null);
          setUser(null);
        }
      } else if (savedUser) {
        // No token but user exists in localStorage - clear it
        localStorage.removeItem("user");
      }
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        token,
        login,
        logout,
        updateLessonProgress,
        loadProgress,
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
