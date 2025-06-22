import { NextFunction, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getAllReports = async (req: Request, res: Response) => {
  const reports = await prisma.report.findMany();
  res.json(reports);
};

export const getReportById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const report = await prisma.report.findUnique({ where: { id } });
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (error) {
    next(error);
  }
};
export const createReport = async (req: Request, res: Response) => {
  const data = req.body;
  const newReport = await prisma.report.create({ data });
  res.status(201).json(newReport);
};

export const updateReport = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const updated = await prisma.report.update({ where: { id: Number(id) }, data });
  res.json(updated);
};

export const deleteReport = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.report.delete({ where: { id: Number(id) } });
  res.status(204).send();
};