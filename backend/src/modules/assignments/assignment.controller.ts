import { Request, Response } from 'express';
import { AssignmentService, createAssignmentSchema } from './assignment.service';
import { AuthRequest } from '../../middleware/auth.middleware';
import { ApiResponse } from '../../utils/ApiResponse';
import { asyncWrapper } from '../../utils/asyncWrapper';

const assignmentService = new AssignmentService();

export const createAssignment = asyncWrapper(async (req: AuthRequest, res: Response) => {
    const data = createAssignmentSchema.parse(req.body);
    const assignment = await assignmentService.createAssignment(data, req.user!.id);
    res.status(201).json(new ApiResponse(201, 'Assignment created', assignment));
});

export const getAssignmentsByCourse = asyncWrapper(async (req: Request, res: Response) => {
    const assignments = await assignmentService.getAssignmentsByCourse(req.params.courseId);
    res.json(new ApiResponse(200, 'Assignments retrieved', assignments));
});

export const getAssignmentById = asyncWrapper(async (req: Request, res: Response) => {
    const assignment = await assignmentService.getAssignmentById(req.params.id);
    res.json(new ApiResponse(200, 'Assignment retrieved', assignment));
});

export const updateAssignment = asyncWrapper(async (req: AuthRequest, res: Response) => {
    const assignment = await assignmentService.updateAssignment(req.params.id, req.user!.id, req.body);
    res.json(new ApiResponse(200, 'Assignment updated', assignment));
});

export const deleteAssignment = asyncWrapper(async (req: AuthRequest, res: Response) => {
    await assignmentService.deleteAssignment(req.params.id, req.user!.id);
    res.json(new ApiResponse(200, 'Assignment deleted'));
});
