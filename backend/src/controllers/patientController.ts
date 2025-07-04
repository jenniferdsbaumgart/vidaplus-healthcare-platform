import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';

export const getAllPatients = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const patients = await prisma.patient.findMany({
      include: {
        appointments: {
          include: {
            doctor: true, 
          },
        },
      },
    });
    res.json(patients);
  } catch (error) {
      next(error);
    }
  }


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

export const getPatientByUserId = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  try {
    const patient = await prisma.patient.findFirst({
      where: { userId: Number(userId) },
    });

    if (!patient) {
      res.status(404).json({ message: "patient not found" });
    }

    res.json(patient);
  } catch (error) {
    console.error("Error fetching patient by userId:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createPatient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { full_name, cpf, birth_date, gender, email, phone } = req.body;

    if (!full_name || !cpf || !birth_date || !gender || !email) {
      return res.status(400).json({ message: 'Campos obrigatórios faltando.' });
    }

    const provisionalPassword = cpf.replace(/\D/g, '');

    const hashedPassword = await bcrypt.hash(provisionalPassword, 10);

    const createdUser = await prisma.user.create({
      data: {
        name: full_name,
        email,
        password: hashedPassword,
        role: 'patient'
      }
    });

    const patient = await prisma.patient.create({
      data: {
        full_name,
        cpf,
        birth_date: new Date(birth_date),
        gender,
        email,
        phone,
        userId: createdUser.id
      }
    });

    res.status(201).json({
      message: 'Paciente criado com sucesso.',
      patient,
      provisionalPassword
    });
  } catch (error) {
    next(error);
  }
}

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
