import { Submission } from './submission.model';
import { Assignment } from '../assignments/assignment.model';
import { Course } from '../courses/course.model';
import { ApiError } from '../../utils/ApiError';
import { z } from 'zod';

export const createSubmissionSchema = z.object({
    assignmentId: z.string(),
    textContent: z.string().optional(),
    fileUrl: z.string().url().optional(),
});

export const gradeSubmissionSchema = z.object({
    grade: z.number().min(0).max(100),
    feedback: z.string().optional(),
});

export class SubmissionService {
    async submit(data: z.infer<typeof createSubmissionSchema>, studentId: string) {
        const assignment = await Assignment.findById(data.assignmentId);
        if (!assignment) throw new ApiError(404, 'Assignment not found');

        if (new Date() > assignment.deadline) {
            throw new ApiError(400, 'Deadline has passed');
        }

        const existing = await Submission.findOne({ assignmentId: data.assignmentId, studentId });
        if (existing) throw new ApiError(409, 'Already submitted this assignment');

        return Submission.create({ ...data, studentId, status: 'submitted' });
    }

    async getSubmissionsByAssignment(assignmentId: string) {
        return Submission.find({ assignmentId })
            .populate('studentId', 'name email avatar')
            .sort({ submittedAt: -1 });
    }

    async getStudentSubmissions(studentId: string) {
        return Submission.find({ studentId }).populate('assignmentId').sort({ submittedAt: -1 });
    }

    async getInstructorSubmissions(instructorId: string) {
        const courses = await Course.find({ instructorId }).select('_id');
        const courseIds = courses.map(c => c._id);
        if (courseIds.length === 0) return [];

        const assignments = await Assignment.find({ courseId: { $in: courseIds } }).select('_id');
        const assignmentIds = assignments.map(a => a._id);
        if (assignmentIds.length === 0) return [];

        return Submission.find({ assignmentId: { $in: assignmentIds } })
            .populate('studentId', 'name email avatar')
            .populate({
                path: 'assignmentId',
                select: 'title courseId',
                populate: {
                    path: 'courseId',
                    select: 'title'
                }
            })
            .sort({ submittedAt: -1 });
    }

    async gradeSubmission(submissionId: string, data: z.infer<typeof gradeSubmissionSchema>) {
        const submission = await Submission.findById(submissionId);
        if (!submission) throw new ApiError(404, 'Submission not found');
        submission.grade = data.grade;
        submission.feedback = data.feedback;
        submission.status = 'graded';
        submission.gradedAt = new Date();
        await submission.save();
        return submission;
    }
}
