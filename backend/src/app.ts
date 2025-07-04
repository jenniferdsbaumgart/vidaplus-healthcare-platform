import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middlewares/errorHandler';
import patientRoutes from './routes/patientRoutes';
import authRoutes from './routes/authRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import examRoutes from './routes/examRoutes';
import staffRoutes from './routes/staffRoutes';
import telemedicineRoutes from './routes/telemedicineRoutes';
import prescriptionsRoutes from './routes/prescriptionsRoutes';

const app = express();
app.set('trust proxy', 1);

app.use(cors({
  origin: ["https://vidaplus.vercel.app"],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());
app.use(morgan('dev'));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prescriptions', prescriptionsRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/telemedicine', telemedicineRoutes);

app.get('/', (req, res) => {
  res.send('VidaPlus API is running 🚀');
});

app.use(errorHandler);

export default app;
