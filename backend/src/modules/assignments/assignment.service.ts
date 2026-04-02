import { Assignment } from './assignment.model';
import { Course } from '../courses/course.model';
import { ApiError } from '../../utils/ApiError';
import { z } from 'zod';

export const createAssignmentSchema = z.object({
    courseId: z.string(),
    title: z.string().min(3),
    description: z.string().min(10),
    deadline: z.string().transform(v => new Date(v)),
    maxScore: z.number().default(100),
});

export class AssignmentService {
    async createAssignment(data: z.infer<typeof createAssignmentSchema>, instructorId: string) {
        const course = await Course.findById(data.courseId);
        if (!course) throw new ApiError(404, 'Course not found');
        if (course.instructorId.toString() !== instructorId) {
            throw new ApiError(403, 'Not authorized');
        }
        return Assignment.create(data);
    }

    async getAssignmentsByCourse(courseId: string) {
        return Assignment.find({ courseId }).sort({ createdAt: -1 });
    }

    async getAssignmentById(id: string) {
        const assignment = await Assignment.findById(id);
        if (!assignment) throw new ApiError(404, 'Assignment not found');
        return assignment;
    }

    async updateAssignment(id: string, instructorId: string, data: Partial<z.infer<typeof createAssignmentSchema>>) {
        const assignment = await Assignment.findById(id);
        if (!assignment) throw new ApiError(404, 'Assignment not found');
        const course = await Course.findById(assignment.courseId);
        if (course?.instructorId.toString() !== instructorId) throw new ApiError(403, 'Not authorized');
        Object.assign(assignment, data);
        await assignment.save();
        return assignment;
    }

    async deleteAssignment(id: string, instructorId: string) {
        const assignment = await Assignment.findById(id);
        if (!assignment) throw new ApiError(404, 'Assignment not found');
        const course = await Course.findById(assignment.courseId);
        if (course?.instructorId.toString() !== instructorId) throw new ApiError(403, 'Not authorized');
        await assignment.deleteOne();
    }
}
