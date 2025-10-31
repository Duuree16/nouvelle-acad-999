import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { User } from '../models/User';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Rate limiter for login endpoint (max 5 attempts per 15 minutes)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 requests per windowMs
  message: {
    error: 'Too many login attempts. Try again in 15 minutes',
    code: 'RATE_LIMIT_EXCEEDED',
    statusCode: 429,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation schemas
const registerSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().toLowerCase().trim(),
  password: z
    .string()
    .min(8)
    .max(128)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number'
    ),
  phoneNumber: z.string().min(10).max(15),
});

const loginSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1),
});

// Helper function to generate JWT token
function generateToken(userId: string, email: string): string {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign({ userId, email }, jwtSecret, { expiresIn: '10h' });
}

// POST /api/auth/register - Create new user account
router.post('/register', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = registerSchema.parse(req.body);

    // Check if email already exists
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      res.status(409).json({
        error: 'Email already registered',
        code: 'DUPLICATE_EMAIL',
        statusCode: 409,
      });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create user
    const user = await User.create({
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
      phoneNumber: validatedData.phoneNumber,
    });

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.email);

    // Return user data (without password) and token
    res.status(201).json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        avatar: user.avatar || null,
        createdAt: user.createdAt.toISOString(),
      },
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Invalid input data',
        code: 'VALIDATION_ERROR',
        statusCode: 400,
        details: error.errors,
      });
      return;
    }

    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      code: 'SERVER_ERROR',
      statusCode: 500,
    });
  }
});

// POST /api/auth/login - Authenticate existing user
router.post('/login', loginLimiter, async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = loginSchema.parse(req.body);

    // Find user by email
    const user = await User.findOne({ email: validatedData.email });
    if (!user) {
      res.status(401).json({
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS',
        statusCode: 401,
      });
      return;
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(
      validatedData.password,
      user.password
    );
    if (!isPasswordValid) {
      res.status(401).json({
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS',
        statusCode: 401,
      });
      return;
    }

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.email);

    // Return user data (without password) and token
    res.status(200).json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        avatar: user.avatar || null,
        createdAt: user.createdAt.toISOString(),
      },
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Invalid credentials',
        code: 'VALIDATION_ERROR',
        statusCode: 400,
      });
      return;
    }

    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      code: 'SERVER_ERROR',
      statusCode: 500,
    });
  }
});

// GET /api/auth/me - Get current authenticated user's data
router.get('/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required',
        code: 'UNAUTHORIZED',
        statusCode: 401,
      });
      return;
    }

    // Find user by ID
    const user = await User.findById(req.user.userId);
    if (!user) {
      res.status(404).json({
        error: 'User not found',
        code: 'NOT_FOUND',
        statusCode: 404,
      });
      return;
    }

    // Return user data (without password)
    res.status(200).json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        avatar: user.avatar || null,
        createdAt: user.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Failed to fetch user',
      code: 'SERVER_ERROR',
      statusCode: 500,
    });
  }
});

export default router;
