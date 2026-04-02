import { Response } from 'express';
import { ProgressService } from './progress.service';
import { AuthRequest } from '../../middleware/auth.middleware';
import { ApiResponse } from '../../utils/ApiResponse';
import { asyncWrapper } from '../../utils/asyncWrapper';

const progressService = new ProgressService();

export const getProgress = asyncWrapper(async (req: AuthRequest, res: Response) => {
    const { courseId } = req.params;
    const progress = await progressService.getProgress(req.user!.id, courseId);
    res.json(new ApiResponse(200, 'Progress retrieved', progress));
});

export const getMyProgress = asyncWrapper(async (req: AuthRequest, res: Response) => {
    const progresses = await progressService.getStudentAllProgress(req.user!.id);
    res.json(new ApiResponse(200, 'All progress', progresses));
});

export const markLessonComplete = asyncWrapper(async (req: AuthRequest, res: Response) => {
    const { courseId, lessonId } = req.body;
    const progress = await progressService.markLessonComplete(req.user!.id, courseId, lessonId);
    res.json(new ApiResponse(200, 'Lesson marked complete', progress));
});
