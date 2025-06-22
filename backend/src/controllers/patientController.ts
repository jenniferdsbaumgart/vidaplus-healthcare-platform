import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

export const getAllPatients = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const patients = await prisma.patient.findMany({
      include: {
        appointments: {
          include: {
            doctor: true, // se quiser o nome do médico também
          },
        },
      },
    });
    res.json(patients);
  } catch (error) {
    next(error);
  }
};

export const getPatientById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: { exams: true },
    });

    if (!patient) {
      res.status(404).json({ message: 'Patient not found' });
      return;
    }

    res.json(patient);
  } catch (error) {
    next(error);
  }
};

export const createPatient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { full_name, cpf, birth_date, gender, email, phone } = req.body;

    console.log('[createPatient] req.body:', req.body);

    if (!full_name || !cpf || !birth_date || !gender) {
      res.status(400).json({ message: 'Campos obrigatórios faltando.' });
      return;
    }

    const newPatient = await prisma.patient.create({
      data: {
        full_name,
        cpf,
        birth_date: new Date(birth_date),
        gender,
        ...(email && { email }),
        ...(phone && { phone })
      }
    });

    res.status(201).json(newPatient);
  } catch (error) {
    console.error('[createPatient] erro:', error);
    next(error);
  }
};

export const updatePatient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const { full_name, cpf, birth_date, gender, email, phone } = req.body;
    const updatedPatient = await prisma.patient.update({
      where: { id },
      data: { full_name, cpf, birth_date, gender, email, phone },
    });
    res.json(updatedPatient);
  } catch (error) {
    next(error);
  }
};

export const deletePatient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Number(req.params.id);
    await prisma.patient.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
