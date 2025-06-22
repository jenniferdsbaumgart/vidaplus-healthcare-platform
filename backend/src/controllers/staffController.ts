import { NextFunction, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getAllStaff = async (req: Request, res: Response): Promise<void> => {
  const staff = await prisma.staff.findMany();
  res.json(staff);
};

export const getStaffById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const staff = await prisma.staff.findUnique({ where: { id } });

    if (!staff) {
      res.status(404).json({ message: 'Staff not found' });
      return;
    }

    res.json(staff);
  } catch (error) {
    next(error);
  }
};

export const createStaff = async (req: Request, res: Response): Promise<void> => {
  const data = req.body;
  const newStaff = await prisma.staff.create({ data });
  res.status(201).json(newStaff);
};

export const updateStaff = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const data = req.body;
  const updated = await prisma.staff.update({ where: { id: Number(id) }, data });
  res.json(updated);
};

export const deleteStaff = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  await prisma.staff.delete({ where: { id: Number(id) } });
  res.status(204).send();
};
