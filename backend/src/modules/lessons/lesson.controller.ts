import { Request, Response } from 'express';
import { LessonService, createLessonSchema } from './lesson.service';
import { AuthRequest } from '../../middleware/auth.middleware';
import { ApiResponse } from '../../utils/ApiResponse';
import { asyncWrapper } from '../../utils/asyncWrapper';

const lessonService = new LessonService();

export const createLesson = asyncWrapper(async (req: AuthRequest, res: Response) => {
    const data = createLessonSchema.parse(req.body);
    const lesson = await lessonService.createLesson(data, req.user!.id);
    res.status(201).json(new ApiResponse(201, 'Lesson created', lesson));
});

export const getLessonsByCourse = asyncWrapper(async (req: Request, res: Response) => {
    const lessons = await lessonService.getLessonsByCourse(req.params.courseId as string);
    res.json(new ApiResponse(200, 'Lessons retrieved', lessons));
});

export const getLessonById = asyncWrapper(async (req: Request, res: Response) => {
    const lesson = await lessonService.getLessonById(req.params.id as string);
    res.json(new ApiResponse(200, 'Lesson retrieved', lesson));
});

export const updateLesson = asyncWrapper(async (req: AuthRequest, res: Response) => {
    const lesson = await lessonService.updateLesson(req.params.id as string, req.user!.id, req.body);
    res.json(new ApiResponse(200, 'Lesson updated', lesson));
});

export const deleteLesson = asyncWrapper(async (req: AuthRequest, res: Response) => {
    await lessonService.deleteLesson(req.params.id as string, req.user!.id);
    res.json(new ApiResponse(200, 'Lesson deleted'));
});

export const reorderLessons = asyncWrapper(async (req: AuthRequest, res: Response) => {
    await lessonService.reorderLessons(req.params.courseId as string, req.body.orders, req.user!.id);
    res.json(new ApiResponse(200, 'Lessons reordered'));
});
