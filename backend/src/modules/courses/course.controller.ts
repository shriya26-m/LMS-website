import { Request, Response } from 'express';
import { CourseService, createCourseSchema, updateCourseSchema } from './course.service';
import { AuthRequest } from '../../middleware/auth.middleware';
import { ApiResponse } from '../../utils/ApiResponse';
import { asyncWrapper } from '../../utils/asyncWrapper';

const courseService = new CourseService();

export const createCourse = asyncWrapper(async (req: AuthRequest, res: Response) => {
    const data = createCourseSchema.parse(req.body);
    const course = await courseService.createCourse(data, req.user!.id);
    res.status(201).json(new ApiResponse(201, 'Course created', course));
});

export const getAllCourses = asyncWrapper(async (req: Request, res: Response) => {
    const { page = '1', limit = '10', search, category, level } = req.query as Record<string, string>;
    const result = await courseService.getAllCourses(Number(page), Number(limit), search, category, level);
    res.json(new ApiResponse(200, 'Courses retrieved', result));
});

export const getInstructorCourses = asyncWrapper(async (req: AuthRequest, res: Response) => {
    const { page = '1', limit = '10' } = req.query as Record<string, string>;
    const result = await courseService.getInstructorCourses(req.user!.id, Number(page), Number(limit));
    res.json(new ApiResponse(200, 'Instructor courses', result));
});

export const getCourseById = asyncWrapper(async (req: Request, res: Response) => {
    const course = await courseService.getCourseById(req.params.id);
    res.json(new ApiResponse(200, 'Course retrieved', course));
});

export const updateCourse = asyncWrapper(async (req: AuthRequest, res: Response) => {
    const data = updateCourseSchema.parse(req.body);
    const course = await courseService.updateCourse(req.params.id, req.user!.id, data, req.user!.role);
    res.json(new ApiResponse(200, 'Course updated', course));
});

export const deleteCourse = asyncWrapper(async (req: AuthRequest, res: Response) => {
    await courseService.deleteCourse(req.params.id, req.user!.id, req.user!.role);
    res.json(new ApiResponse(200, 'Course deleted'));
});

export const publishCourse = asyncWrapper(async (req: AuthRequest, res: Response) => {
    const course = await courseService.publishCourse(req.params.id, req.user!.id);
    res.json(new ApiResponse(200, `Course ${course.isPublished ? 'published' : 'unpublished'}`, course));
});

export const enrollStudent = asyncWrapper(async (req: AuthRequest, res: Response) => {
    const course = await courseService.enrollStudent(req.params.id, req.user!.id);
    res.json(new ApiResponse(200, 'Enrolled successfully', course));
});

export const getEnrolledStudents = asyncWrapper(async (req: Request, res: Response) => {
    const students = await courseService.getEnrolledStudents(req.params.id);
    res.json(new ApiResponse(200, 'Enrolled students', students));
});

export const getCategories = asyncWrapper(async (_req: Request, res: Response) => {
    const categories = await courseService.getCategories();
    res.json(new ApiResponse(200, 'Categories', categories));
});

export const getCourseStats = asyncWrapper(async (_req: Request, res: Response) => {
    const stats = await courseService.getStats();
    res.json(new ApiResponse(200, 'Course stats', stats));
});
