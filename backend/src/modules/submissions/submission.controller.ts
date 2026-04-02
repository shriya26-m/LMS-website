import { Request, Response } from 'express';
import { SubmissionService, createSubmissionSchema, gradeSubmissionSchema } from './submission.service';
import { AuthRequest } from '../../middleware/auth.middleware';
import { ApiResponse } from '../../utils/ApiResponse';
import { asyncWrapper } from '../../utils/asyncWrapper';

const submissionService = new SubmissionService();

export const getInstructorSubmissions = asyncWrapper(async (req: AuthRequest, res: Response) => {
    const submissions = await submissionService.getInstructorSubmissions(req.user!.id);
    res.json(new ApiResponse(200, 'Instructor submissions', submissions));
});

export const submit = asyncWrapper(async (req: AuthRequest, res: Response) => {
    const data = createSubmissionSchema.parse(req.body);
    const submission = await submissionService.submit(data, req.user!.id);
    res.status(201).json(new ApiResponse(201, 'Submitted successfully', submission));
});

export const getSubmissionsByAssignment = asyncWrapper(async (req: Request, res: Response) => {
    const submissions = await submissionService.getSubmissionsByAssignment(req.params.assignmentId as string);
    res.json(new ApiResponse(200, 'Submissions retrieved', submissions));
});

export const getMySubmissions = asyncWrapper(async (req: AuthRequest, res: Response) => {
    const submissions = await submissionService.getStudentSubmissions(req.user!.id);
    res.json(new ApiResponse(200, 'My submissions', submissions));
});

export const gradeSubmission = asyncWrapper(async (req: Request, res: Response) => {
    const data = gradeSubmissionSchema.parse(req.body);
    const submission = await submissionService.gradeSubmission(req.params.id as string, data);
    res.json(new ApiResponse(200, 'Submission graded', submission));
});
