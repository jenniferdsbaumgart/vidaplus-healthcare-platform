import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

export const getAllAppointments = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        patient: {
          select: {
            id: true,
            full_name: true,
          },
        },
        doctor: {
          select: {
            id: true,
            full_name: true,
            specialization: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    res.json(appointments);
  } catch (error) {
    next(error);
  }
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

export const createAppointment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { patientId, doctorId, date, time, type, status } = req.body;

    const doctor = await prisma.staff.findUnique({
      where: { id: doctorId },
    });

    if (!doctor) {
      res.status(404).json({ message: 'Médico não encontrado.' });
      return;
    }

    const newAppointment = await prisma.appointment.create({
      data: {
        patient_id: patientId,
        doctor_id: doctorId,
        doctor_name: doctor.full_name,
        date: new Date(date),
        time,
        type,
        status,
      },
    });

    res.status(201).json(newAppointment);
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    res.status(500).json({ message: 'Erro ao criar agendamento.', error });
  }
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
