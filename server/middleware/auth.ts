import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}

interface JWTPayload {
  userId: string;
  email: string;
}

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

    if (!token) {
      res.status(401).json({
        error: 'Authentication required',
        code: 'UNAUTHORIZED',
        statusCode: 401,
      });
      return;
    }

    // Verify token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;

    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        error: 'Invalid or expired token',
        code: 'UNAUTHORIZED',
        statusCode: 401,
      });
      return;
    }

    // Other errors
    res.status(500).json({
      error: 'Authentication failed',
      code: 'SERVER_ERROR',
      statusCode: 500,
    });
  }
}
