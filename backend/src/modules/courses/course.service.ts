import { Course } from './course.model';
import { Lesson } from '../lessons/lesson.model';
import { ApiError } from '../../utils/ApiError';
import { paginate } from '../../utils/paginate.util';
import { z } from 'zod';
import mongoose from 'mongoose';

export const createCourseSchema = z.object({
    title: z.string().min(5),
    description: z.string().min(20),
    category: z.string(),
    level: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
    price: z.number().min(0).default(0),
    tags: z.array(z.string()).optional(),
    thumbnail: z.string().optional(),
});

export const updateCourseSchema = createCourseSchema.partial();

export class CourseService {
    async createCourse(data: z.infer<typeof createCourseSchema>, instructorId: string) {
        const course = await Course.create({ ...data, instructorId });
        return course;
    }

    async getAllCourses(page = 1, limit = 10, search?: string, category?: string, level?: string) {
        const query: Record<string, unknown> = { isPublished: true };
        if (search) query.$text = { $search: search };
        if (category) query.category = category;
        if (level) query.level = level;

        const total = await Course.countDocuments(query);
        const courses = await Course.find(query)
            .populate('instructorId', 'name email avatar')
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });

        return paginate(courses, total, { page, limit });
    }

    async getInstructorCourses(instructorId: string, page = 1, limit = 10) {
        const query = { instructorId };
        const total = await Course.countDocuments(query);
        const courses = await Course.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });
        return paginate(courses, total, { page, limit });
    }

    async getCourseById(id: string) {
        const course = await Course.findById(id).populate('instructorId', 'name email avatar bio');
        if (!course) throw new ApiError(404, 'Course not found');
        return course;
    }

    async updateCourse(id: string, instructorId: string, data: z.infer<typeof updateCourseSchema>, role: string) {
        const course = await Course.findById(id);
        if (!course) throw new ApiError(404, 'Course not found');
        if (role !== 'admin' && course.instructorId.toString() !== instructorId) {
            throw new ApiError(403, 'You are not the instructor of this course');
        }
        Object.assign(course, data);
        await course.save();
        return course;
    }

    async deleteCourse(id: string, instructorId: string, role: string) {
        const course = await Course.findById(id);
        if (!course) throw new ApiError(404, 'Course not found');
        if (role !== 'admin' && course.instructorId.toString() !== instructorId) {
            throw new ApiError(403, 'You are not the instructor of this course');
        }
        await course.deleteOne();
    }

    async publishCourse(id: string, instructorId: string) {
        const course = await Course.findById(id);
        if (!course) throw new ApiError(404, 'Course not found');
        if (course.instructorId.toString() !== instructorId) {
            throw new ApiError(403, 'Not authorized');
        }
        course.isPublished = !course.isPublished;
        await course.save();
        return course;
    }

    async enrollStudent(courseId: string, studentId: string) {
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            throw new ApiError(400, 'Invalid course ID format');
        }
        const course = await Course.findById(courseId);
        if (!course) throw new ApiError(404, 'Course not found');
        if (!course.isPublished) throw new ApiError(400, 'Course is not published');

        const alreadyEnrolled = course.enrolledStudents.includes(new mongoose.Types.ObjectId(studentId));
        if (alreadyEnrolled) throw new ApiError(409, 'Already enrolled in this course');

        course.enrolledStudents.push(new mongoose.Types.ObjectId(studentId));
        await course.save();
        return course;
    }

    async getEnrolledStudents(courseId: string) {
        const course = await Course.findById(courseId).populate('enrolledStudents', 'name email avatar');
        if (!course) throw new ApiError(404, 'Course not found');
        return course.enrolledStudents;
    }

    async getCategories() {
        const categories = await Course.distinct('category', { isPublished: true });
        return categories;
    }

    async getStats() {
        const [totalCourses, publishedCourses, totalEnrollments] = await Promise.all([
            Course.countDocuments(),
            Course.countDocuments({ isPublished: true }),
            Course.aggregate([{ $project: { count: { $size: '$enrolledStudents' } } }, { $group: { _id: null, total: { $sum: '$count' } } }]),
        ]);
        return {
            totalCourses,
            publishedCourses,
            totalEnrollments: totalEnrollments[0]?.total || 0,
        };
    }
}
