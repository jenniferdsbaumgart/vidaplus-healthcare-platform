import { NextFunction, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';

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
  const {
    name,
    email,
    password,
    phone,
    address,
    birth_date,
    gender,
    registration_number,
    specialization,
    role,
    available_schedule,
  } = req.body;

  try {
    // Cenário 1: Cadastro com User (registro via /register)
    if (name && email && password) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        res.status(409).json({ message: 'E-mail já cadastrado.' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
          staff: {
            create: {
              full_name: name,
              email,
              phone,
              address,
              birth_date: birth_date ? new Date(birth_date) : undefined,
              gender,
              registration_number,
              specialization,
              available_schedule,
              role,
            },
          },
        },
        include: { staff: true },
      });

      res.status(201).json({
        message: 'Usuário e profissional criados com sucesso.',
        staff: newUser.staff,
      });

    } else {
      // Cenário 2: Cadastro direto de staff (painel do admin)
      const newStaff = await prisma.staff.create({
        data: {
          full_name: req.body.full_name,
          email,
          phone,
          address,
          birth_date: birth_date ? new Date(birth_date) : undefined,
          gender,
          registration_number,
          specialization,
          available_schedule,
          role,
        },
      });

      res.status(201).json({
        message: 'Profissional criado com sucesso.',
        staff: newStaff,
      });
    }
  } catch (error) {
    console.error('[createStaff] erro:', error);
    res.status(500).json({ message: 'Erro ao criar profissional.', error });
  }
};

export const getStaffByUserId = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  try {
    const staff = await prisma.staff.findFirst({
      where: { userId: Number(userId) },
    });

    if (!staff) {
      res.status(404).json({ message: "Staff not found" });
    }

    res.json(staff);
  } catch (error) {
    console.error("Error fetching staff by userId:", error);
    res.status(500).json({ message: "Server error" });
  }
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
