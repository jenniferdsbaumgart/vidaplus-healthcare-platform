import { NextFunction, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getAllPrescriptions = async (req: Request, res: Response): Promise<void> => {
  const prescriptions = await prisma.prescription.findMany({
    include: {
      patient: { select: { full_name: true } },
      doctor: { select: { full_name: true } },
      medication: { select: { name: true } },
    },
  });
  res.json(prescriptions);
};

export const getPrescriptionById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const prescription = await prisma.prescription.findUnique({
      where: { id },
      include: {
        patient: { select: { full_name: true } },
        doctor: { select: { full_name: true } },
        medication: { select: { name: true } },
      },
    });

    if (!prescription) {
      res.status(404).json({ message: 'Prescription not found' });
      return;
    }

    res.json(prescription);
  } catch (error) {
    next(error);
  }
};

export const createPrescription = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { patient_id, doctor_id, medication_id, dosage, instructions } = req.body;

    if (!patient_id || !medication_id) {
      res.status(400).json({ message: 'patient_id and medication_id are required' });
      return;
    }

    const newPrescription = await prisma.prescription.create({
      data: {
        patient_id: Number(patient_id),
        doctor_id: doctor_id ? Number(doctor_id) : null,
        medication_id: Number(medication_id),
        dosage,
        instructions,
      },
    });

    res.status(201).json(newPrescription);
  } catch (error) {
    next(error);
  }
};

export const updatePrescription = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { patient_id, doctor_id, medication_id, dosage, instructions } = req.body;

    const updated = await prisma.prescription.update({
      where: { id: Number(id) },
      data: {
        patient_id: patient_id ? Number(patient_id) : undefined,
        doctor_id: doctor_id ? Number(doctor_id) : null,
        medication_id: medication_id ? Number(medication_id) : undefined,
        dosage,
        instructions,
      },
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const deletePrescription = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.prescription.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
