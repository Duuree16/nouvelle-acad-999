import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { Progress } from '../models/Progress';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all progress routes
router.use(authenticateToken);

// Validation schema for progress update
const progressUpdateSchema = z.object({
  lessonId: z
    .string()
    .regex(
      /^lesson-[1-6]$/,
      'Lesson ID must match pattern "lesson-1" through "lesson-6"'
    ),
  score: z.number().min(0).max(100),
  completed: z.boolean(),
  progress: z.number().min(0).max(100),
});

// POST /api/progress - Update or create lesson progress (upsert)
router.post('/', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required',
        code: 'UNAUTHORIZED',
        statusCode: 401,
      });
      return;
    }

    // Validate request body
    const validatedData = progressUpdateSchema.parse(req.body);

    // Find existing progress entry
    const existingProgress = await Progress.findOne({
      userId: req.user.userId,
      lessonId: validatedData.lessonId,
    });

    // Prepare update data
    const updateData: any = {
      userId: req.user.userId,
      lessonId: validatedData.lessonId,
      score: validatedData.score,
      completed: validatedData.completed,
      progress: validatedData.progress,
    };

    // Set completedAt if completed is true and wasn't completed before
    if (validatedData.completed && (!existingProgress || !existingProgress.completed)) {
      updateData.completedAt = new Date();
    }

    // Upsert progress entry
    const progressEntry = await Progress.findOneAndUpdate(
      {
        userId: req.user.userId,
        lessonId: validatedData.lessonId,
      },
      updateData,
      {
        upsert: true,
        new: true, // Return the updated document
        setDefaultsOnInsert: true,
      }
    );

    // Determine status code (201 for new, 200 for update)
    const statusCode = existingProgress ? 200 : 201;

    // Return updated progress entry
    res.status(statusCode).json({
      progress: {
        id: progressEntry._id.toString(),
        lessonId: progressEntry.lessonId,
        completed: progressEntry.completed,
        score: progressEntry.score,
        progress: progressEntry.progress,
        completedAt: progressEntry.completedAt
          ? progressEntry.completedAt.toISOString()
          : null,
        createdAt: progressEntry.createdAt.toISOString(),
        updatedAt: progressEntry.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Invalid progress data',
        code: 'VALIDATION_ERROR',
        statusCode: 400,
        details: error.errors,
      });
      return;
    }

    console.error('Progress update error:', error);
    res.status(500).json({
      error: 'Failed to save progress',
      code: 'SERVER_ERROR',
      statusCode: 500,
    });
  }
});

// GET /api/progress - Get all progress for current authenticated user
router.get('/', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required',
        code: 'UNAUTHORIZED',
        statusCode: 401,
      });
      return;
    }

    // Query all progress entries for this user, sorted by most recent first
    const progressEntries = await Progress.find({
      userId: req.user.userId,
    }).sort({ updatedAt: -1 });

    // Return array of progress entries
    res.status(200).json({
      progress: progressEntries.map((entry) => ({
        id: entry._id.toString(),
        lessonId: entry.lessonId,
        completed: entry.completed,
        score: entry.score,
        progress: entry.progress,
        completedAt: entry.completedAt
          ? entry.completedAt.toISOString()
          : null,
        createdAt: entry.createdAt.toISOString(),
        updatedAt: entry.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Progress fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch progress',
      code: 'SERVER_ERROR',
      statusCode: 500,
    });
  }
});

// GET /api/progress/:lessonId - Get progress for specific lesson
router.get('/:lessonId', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required',
        code: 'UNAUTHORIZED',
        statusCode: 401,
      });
      return;
    }

    const { lessonId } = req.params;

    // Validate lessonId format
    if (!/^lesson-[1-6]$/.test(lessonId)) {
      res.status(400).json({
        error: 'Invalid lesson ID',
        code: 'VALIDATION_ERROR',
        statusCode: 400,
      });
      return;
    }

    // Find progress entry for this user and lesson
    const progressEntry = await Progress.findOne({
      userId: req.user.userId,
      lessonId,
    });

    if (!progressEntry) {
      res.status(404).json({
        error: 'Progress not found for this lesson',
        code: 'NOT_FOUND',
        statusCode: 404,
      });
      return;
    }

    // Return progress entry
    res.status(200).json({
      progress: {
        id: progressEntry._id.toString(),
        lessonId: progressEntry.lessonId,
        completed: progressEntry.completed,
        score: progressEntry.score,
        progress: progressEntry.progress,
        completedAt: progressEntry.completedAt
          ? progressEntry.completedAt.toISOString()
          : null,
        createdAt: progressEntry.createdAt.toISOString(),
        updatedAt: progressEntry.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Progress fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch progress',
      code: 'SERVER_ERROR',
      statusCode: 500,
    });
  }
});

export default router;
