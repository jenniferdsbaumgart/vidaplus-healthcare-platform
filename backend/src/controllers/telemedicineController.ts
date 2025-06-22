import { NextFunction, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getAllTelemedicine = async (req: Request, res: Response): Promise<void> => {
  const telemedicine = await prisma.teleconsultation.findMany({
    include: {
      patient: true,
      doctor: true,
    },
    orderBy: {
      date: 'asc',
    },
  });

  res.json(telemedicine);
};

export const getTelemedicineById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const telemedicine = await prisma.teleconsultation.findUnique({ where: { id } });

    if (!telemedicine) {
      res.status(404).json({ message: 'Teleconsultation not found' });
      return;
    }

    res.json(telemedicine);
  } catch (error) {
    next(error);
  }
};

export const createTelemedicine = async (req: Request, res: Response): Promise<void> => {
  const data = req.body;
  const newTelemedicine = await prisma.teleconsultation.create({ data });
  res.status(201).json(newTelemedicine);
};

export const updateTelemedicine = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const data = req.body;
  const updated = await prisma.teleconsultation.update({ where: { id: Number(id) }, data });
  res.json(updated);
};

export const deleteTelemedicine = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  await prisma.teleconsultation.delete({ where: { id: Number(id) } });
  res.status(204).send();
};
