import { Request, Response, RequestHandler } from 'express';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_aqui';
const JWT_EXPIRES_IN = '7d';

// Interface para requests autenticadas
export interface AuthenticatedRequest extends Request {
  userId: number;
}

// Registro de usuário
export const register = async (req: Request, res: Response): Promise<void> => {
  const {
    userType, // 'patient' ou 'staff'
    full_name,
    cpf,
    birth_date,
    gender,
    phone,
    address,
    email,
    password,
    registration_number,
    specialization,
    role
  } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({ message: 'E-mail já cadastrado.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o usuário base
    await prisma.user.create({
      data: {
        name: full_name,
        email,
        password: hashedPassword,
        role: userType === 'staff' ? role : 'patient'
      }
    });

    if (userType === 'patient') {
      await prisma.patient.create({
        data: {
          full_name,
          cpf,
          birth_date: new Date(birth_date),
          gender,
          email,
          phone,
          address
        }
      });
    } else if (userType === 'staff') {
      await prisma.staff.create({
        data: {
          full_name,
          registration_number,
          role,
          specialization,
          email,
          phone,
          created_at: new Date(),
          updated_at: new Date()
        }
      });
    }

    res.status(201).json({ message: 'Usuário criado com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao registrar usuário.', error });
  }
};

// Login de usuário
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ message: 'Usuário não encontrado.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Senha incorreta.' });
      return;
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    });

    res.status(200).json({
      message: 'Login bem-sucedido.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao fazer login.', error });
  }
};

// Obter dados do usuário autenticado
export const getMe: RequestHandler = async (req, res) => {
  const authReq = req as AuthenticatedRequest;

  try {
    const userId = authReq.userId;

    if (!userId || typeof userId !== 'number') {
      res.status(400).json({ message: 'ID de usuário inválido.' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true }
    });

    if (!user) {
      res.status(404).json({ message: 'Usuário não encontrado.' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar dados do usuário.', error });
  }
};
