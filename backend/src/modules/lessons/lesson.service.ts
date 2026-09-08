import mongoose from 'mongoose';
import { Lesson } from './lesson.model';
import { Course } from '../courses/course.model';
import { ApiError } from '../../utils/ApiError';
import { z } from 'zod';

export const createLessonSchema = z.object({
    courseId: z.string(),
    title: z.string().min(3),
    description: z.string().optional(),
    videoUrl: z.string().optional(),
    pdfUrl: z.string().optional(),
    duration: z.number().optional(),
    order: z.number().optional(),
    isFree: z.boolean().optional(),
});

export class LessonService {
    async createLesson(data: z.infer<typeof createLessonSchema>, instructorId: string) {
        const course = await Course.findById(data.courseId);
        if (!course) throw new ApiError(404, 'Course not found');
        if (course.instructorId.toString() !== instructorId) {
            throw new ApiError(403, 'Not authorized to add lessons to this course');
        }

        const lessonCount = await Lesson.countDocuments({ courseId: new mongoose.Types.ObjectId(data.courseId) });
        const lesson = await Lesson.create({ ...data, order: data.order ?? lessonCount + 1 });

        await Course.findByIdAndUpdate(data.courseId, { $inc: { totalLessons: 1 } });
        return lesson;
    }

    async getLessonsByCourse(courseId: string) {
        const lessons = await Lesson.find({ courseId: new mongoose.Types.ObjectId(courseId) }).sort({ order: 1 });
        return lessons;
    }

    async getLessonById(id: string) {
        const lesson = await Lesson.findById(id);
        if (!lesson) throw new ApiError(404, 'Lesson not found');
        return lesson;
    }

    async updateLesson(id: string, instructorId: string, data: Partial<z.infer<typeof createLessonSchema>>) {
        const lesson = await Lesson.findById(id);
        if (!lesson) throw new ApiError(404, 'Lesson not found');

        const course = await Course.findById(lesson.courseId);
        if (!course || course.instructorId.toString() !== instructorId) {
            throw new ApiError(403, 'Not authorized to update this lesson');
        }

        Object.assign(lesson, data);
        await lesson.save();
        return lesson;
    }

    async deleteLesson(id: string, instructorId: string) {
        const lesson = await Lesson.findById(id);
        if (!lesson) throw new ApiError(404, 'Lesson not found');

        const course = await Course.findById(lesson.courseId);
        if (!course || course.instructorId.toString() !== instructorId) {
            throw new ApiError(403, 'Not authorized to delete this lesson');
        }

        await lesson.deleteOne();
        await Course.findByIdAndUpdate(lesson.courseId, { $inc: { totalLessons: -1 } });
    }

    async reorderLessons(courseId: string, orders: { id: string, order: number }[], instructorId: string) {
        const course = await Course.findById(courseId);
        if (!course) throw new ApiError(404, 'Course not found');
        if (course.instructorId.toString() !== instructorId) {
            throw new ApiError(403, 'Not authorized to reorder lessons for this course');
        }

        const updates = orders.map(item =>
            Lesson.findOneAndUpdate(
                { _id: item.id, courseId: new mongoose.Types.ObjectId(courseId) },
                { order: item.order }
            )
        );

        await Promise.all(updates);
    }
}
