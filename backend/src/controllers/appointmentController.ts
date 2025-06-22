import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

export const getAllAppointments = async (req: Request, res: Response): Promise<void> => {
  const appointments = await prisma.appointment.findMany();
  res.json(appointments);
};

export const getAppointmentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const appointment = await prisma.appointment.findUnique({ where: { id: Number(id) } });

    if (!appointment) {
      res.status(404).json({ message: 'Appointment not found' });
      return;
    }

    res.json(appointment);
  } catch (error) {
    next(error);
  }
};

export const createAppointment = async (req: Request, res: Response): Promise<void> => {
  const data = req.body;
  const newAppointment = await prisma.appointment.create({ data });
  res.status(201).json(newAppointment);
};

export const updateAppointment = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const data = req.body;
  const updated = await prisma.appointment.update({ where: { id: Number(id) }, data });
  res.json(updated);
};

export const deleteAppointment = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  await prisma.appointment.delete({ where: { id: Number(id) } });
  res.status(204).send();
};
