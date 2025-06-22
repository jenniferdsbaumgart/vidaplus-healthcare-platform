import { NextFunction, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getAllExams = async (req: Request, res: Response): Promise<void> => {
  const exams = await prisma.exam.findMany();
  res.json(exams);
};

export const getExamById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const exam = await prisma.exam.findUnique({ where: { id } });

    if (!exam) {
      res.status(404).json({ message: 'Exam not found' });
      return;
    }

    res.json(exam);
  } catch (error) {
    next(error);
  }
};

export const createExam = async (req: Request, res: Response): Promise<void> => {
  const data = req.body;
  const newExam = await prisma.exam.create({ data });
  res.status(201).json(newExam);
};

export const updateExam = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updated = await prisma.exam.update({ where: { id: Number(id) }, data });
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteExam = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.exam.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
