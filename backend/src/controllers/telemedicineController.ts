import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getAllTelemedicine = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { date } = req.query;

  const whereClause = date
    ? {
        date: {
          gte: new Date(`${date}T00:00:00.000Z`),
          lt: new Date(`${date}T23:59:59.999Z`),
        },
      }
    : {};

  const telemedicine = await prisma.teleconsultation.findMany({
    where: whereClause,
    include: {
      patient: true,
      doctor: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  res.json(telemedicine);
};

export const getTelemedicineById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const telemedicine = await prisma.teleconsultation.findUnique({
      where: { id },
    });

    if (!telemedicine) {
      res.status(404).json({ message: "Teleconsulta não encontrada." });
      return;
    }

    res.json(telemedicine);
  } catch (error) {
    next(error);
  }
};

export const createTelemedicine = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { patientId, doctorId, date, notes } = req.body;

    const newTelemedicine = await prisma.teleconsultation.create({
      data: {
        date: new Date(date),
        notes,
        patient: {
          connect: { id: patientId },
        },
        doctor: {
          connect: { id: doctorId },
        },
      },
    });

    const doctor = await prisma.staff.findUnique({
      where: { id: doctorId },
    });

    const newAppointment = await prisma.appointment.create({
      data: {
        patient_id: patientId,
        doctor_id: doctorId,
        doctor_name: doctor?.full_name || "Médico(a)",
        date: new Date(date),
        time: new Date(date).toTimeString().slice(0, 5), // HH:MM
        type: "Teleconsulta",
        status: "Agendado",
      },
    });

    res.status(201).json({
      message: "Teleconsulta e consulta registradas com sucesso.",
      teleconsultation: newTelemedicine,
      appointment: newAppointment,
    });
  } catch (error) {
    console.error("[createTelemedicine] erro:", error);
    res.status(500).json({ message: "Erro ao criar teleconsulta.", error });
  }
};

export const updateTelemedicine = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const data = req.body;
  const updated = await prisma.teleconsultation.update({
    where: { id: Number(id) },
    data,
  });
  res.json(updated);
};

export const deleteTelemedicine = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  await prisma.teleconsultation.delete({ where: { id: Number(id) } });
  res.status(204).send();
};
