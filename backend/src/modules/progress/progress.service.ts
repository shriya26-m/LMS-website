import mongoose from 'mongoose';
import { Lesson } from '../lessons/lesson.model';
import { Certificate } from '../certificates/certificate.model';
import { Course } from '../courses/course.model';
import { Progress } from './progress.model';
import { ApiError } from '../../utils/ApiError';
import { v4 as uuidv4 } from 'uuid';

export class ProgressService {
    async getProgress(studentId: string, courseId: string) {
        const progress = await Progress.findOne({ studentId, courseId });
        if (!progress) {
            return { progressPercent: 0, completedLessons: [], isCompleted: false };
        }
        return progress;
    }

    async getStudentAllProgress(studentId: string) {
        const enrolledCourses = await Course.find({ enrolledStudents: studentId })
            .populate('instructorId', 'name')
            .select('title thumbnail totalLessons instructorId updatedAt');

        const progresses = await Progress.find({ studentId });

        return enrolledCourses.map(course => {
            const p = progresses.find(prog => prog.courseId.toString() === course._id.toString());
            return {
                _id: p?._id || `temp-${course._id}`,
                courseId: course,
                studentId,
                completedLessons: p?.completedLessons || [],
                progressPercent: p?.progressPercent || 0,
                isCompleted: p?.isCompleted || false,
                updatedAt: p?.updatedAt || (course as any).updatedAt,
            };
        });
    }

    async markLessonComplete(studentId: string, courseId: string, lessonId: string) {
        const course = await Course.findById(courseId);
        if (!course) throw new ApiError(404, 'Course not found');

        const isEnrolled = course.enrolledStudents.some(id => id.toString() === studentId);
        if (!isEnrolled) throw new ApiError(403, 'Not enrolled in this course');

        let progress = await Progress.findOne({ studentId, courseId });
        if (!progress) {
            progress = await Progress.create({ studentId, courseId, completedLessons: [] });
        }

        const lessonAlreadyDone = progress.completedLessons.some(id => id.toString() === lessonId);
        if (!lessonAlreadyDone) {
            progress.completedLessons.push(new mongoose.Types.ObjectId(lessonId));
        }

        const totalLessons = await Lesson.countDocuments({ courseId });
        progress.progressPercent = totalLessons > 0
            ? Math.round((progress.completedLessons.length / totalLessons) * 100)
            : 0;

        if (progress.progressPercent === 100 && !progress.isCompleted) {
            progress.isCompleted = true;
            progress.completedAt = new Date();
            // Auto-issue certificate with a unique, collision-resistant code
            const certificateCode = `CERT-${uuidv4().replace(/-/g, '').substring(0, 12).toUpperCase()}`;
            await Certificate.findOneAndUpdate(
                { studentId, courseId },
                { studentId, courseId, issueDate: new Date(), certificateCode },
                { upsert: true, new: true }
            );
        }

        await progress.save();
        return progress;
    }
}

