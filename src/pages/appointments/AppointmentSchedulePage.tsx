import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import FileUpload from '../../components/ui/FileUpload';
import Heading from '../../components/ui/Heading';
import { Calendar, Clock, FileText, AlertCircle, Calendar as CalendarIcon, Video } from 'lucide-react';
import { getStaff } from '../../lib/mock/api';
import type { Staff } from '../../lib/mock/data';

// Mock data for specialties
const SPECIALTIES = [
  'Clínica Geral',
  'Cardiologia',
  'Pediatria',
  'Ortopedia',
  'Ginecologia',
  'Dermatologia',
  'Neurologia',
  'Psiquiatria',
  'Endocrinologia',
  'Oftalmologia',
];

// Mock data for clinic hours
const CLINIC_HOURS = {
  start: 8, // 8:00
  end: 18,  // 18:00
};

// Generate time slots
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = CLINIC_HOURS.start; hour < CLINIC_HOURS.end; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    slots.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  return slots;
};

const AppointmentSchedulePage = () => {
  const navigate = useNavigate();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState<'presential' | 'virtual'>('presential');
  const [reason, setReason] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStaff = async () => {
      try {
        setIsLoading(true);
        const data = await getStaff();
        setStaff(data.filter(member => member.role === 'doctor'));
        setError(null);
      } catch (err) {
        console.error('Error loading staff:', err);
        setError('Erro ao carregar lista de médicos');
      } finally {
        setIsLoading(false);
      }
    };

    loadStaff();
  }, []);

  // Filter doctors by specialty
  const availableDoctors = staff.filter(
    doctor => !selectedSpecialty || doctor.specialization === selectedSpecialty
  );

  // Get available time slots
  const timeSlots = generateTimeSlots();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
      // Here you would make an API call to schedule the appointment
      console.log('Scheduling appointment...', {
        doctorId: selectedDoctor,
        date: selectedDate,
        time: selectedTime,
        type: appointmentType,
        reason,
        files,
      });

      // Mock success
      navigate('/appointments/success');
    } catch {
      setError('Erro ao agendar consulta. Por favor, tente novamente.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Heading 
        level="h2"
        description="Preencha os dados para agendar sua consulta"
      >
        Agendar Consulta
      </Heading>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main scheduling form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Consulta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <div className="p-4 bg-error-50 border border-error-200 rounded-lg flex items-start">
                    <AlertCircle className="h-5 w-5 text-error-500 mt-0.5 mr-2" />
                    <p className="text-sm text-error-800">{error}</p>
                  </div>
                )}

                {/* Appointment type selection */}
                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant={appointmentType === 'presential' ? 'primary' : 'outline'}
                    onClick={() => setAppointmentType('presential')}
                    leftIcon={<Calendar className="h-4 w-4" />}
                  >
                    Consulta Presencial
                  </Button>
                  <Button
                    type="button"
                    variant={appointmentType === 'virtual' ? 'primary' : 'outline'}
                    onClick={() => setAppointmentType('virtual')}
                    leftIcon={<Video className="h-4 w-4" />}
                  >
                    Teleconsulta
                  </Button>
                </div>

                {/* Specialty selection */}
                <Select
                  label="Especialidade"
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  required
                  fullWidth
                >
                  <option value="">Selecione uma especialidade</option>
                  {SPECIALTIES.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </Select>

                {/* Doctor selection */}
                <Select
                  label="Médico"
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  required
                  disabled={!selectedSpecialty}
                  fullWidth
                >
                  <option value="">Selecione um médico</option>
                  {availableDoctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.full_name} - {doctor.specialization}
                    </option>
                  ))}
                </Select>

                {/* Date selection */}
                <Input
                  label="Data da Consulta"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  leftIcon={<CalendarIcon className="h-5 w-5" />}
                  fullWidth
                />

                {/* Time selection */}
                <Select
                  label="Horário"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  required
                  disabled={!selectedDate}
                  fullWidth
                >
                  <option value="">Selecione um horário</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </Select>

                {/* Reason for appointment */}
                <Textarea
                  label="Motivo da Consulta"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Descreva brevemente o motivo da consulta..."
                  fullWidth
                  optional
                />

                {/* File upload */}
                <FileUpload
                  label="Anexar Exames ou Documentos"
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                  maxSize={5 * 1024 * 1024} // 5MB
                  helperText="Você pode anexar exames anteriores ou outros documentos relevantes (máx. 5MB por arquivo)"
                  onChange={setFiles}
                  value={files}
                  optional
                />
              </CardContent>
              <CardFooter className="flex justify-end space-x-4 border-t">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate(-1)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  leftIcon={<Calendar className="h-4 w-4" />}
                >
                  Confirmar Agendamento
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Side panel with additional information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Importantes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start p-4 bg-blue-50 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900">Horário de Atendimento</h4>
                    <p className="text-sm text-blue-800 mt-1">
                      Segunda a Sexta: 08:00 às 18:00<br />
                      Sábado: 08:00 às 12:00
                    </p>
                  </div>
                </div>

                <div className="flex items-start p-4 bg-amber-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-3" />
                  <div>
                    <h4 className="text-sm font-medium text-amber-900">Atenção</h4>
                    <ul className="text-sm text-amber-800 mt-1 space-y-1">
                      <li>• Chegue 15 minutos antes do horário agendado</li>
                      <li>• Traga seus documentos pessoais</li>
                      <li>• Em caso de cancelamento, avise com 24h de antecedência</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start p-4 bg-green-50 rounded-lg">
                  <FileText className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                  <div>
                    <h4 className="text-sm font-medium text-green-900">Documentos Necessários</h4>
                    <ul className="text-sm text-green-800 mt-1 space-y-1">
                      <li>• Documento de identidade com foto</li>
                      <li>• Cartão do convênio (se houver)</li>
                      <li>• Exames anteriores relacionados</li>
                      <li>• Lista de medicamentos em uso</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Histórico de Consultas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative pl-6 pb-4 border-l-2 border-gray-200">
                    <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-teal-900"></div>
                    <p className="text-sm font-medium text-gray-900">Clínica Geral</p>
                    <p className="text-xs text-gray-500 mt-1">Dr. Ana Beatriz Santos</p>
                    <p className="text-xs text-gray-400 mt-1">15/03/2024</p>
                  </div>

                  <div className="relative pl-6 pb-4 border-l-2 border-gray-200">
                    <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-teal-700"></div>
                    <p className="text-sm font-medium text-gray-900">Cardiologia</p>
                    <p className="text-xs text-gray-500 mt-1">Dr. Carlos Eduardo Silva</p>
                    <p className="text-xs text-gray-400 mt-1">28/02/2024</p>
                  </div>

                  <div className="relative pl-6">
                    <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-teal-600"></div>
                    <p className="text-sm font-medium text-gray-900">Ortopedia</p>
                    <p className="text-xs text-gray-500 mt-1">Dr. Ricardo Oliveira</p>
                    <p className="text-xs text-gray-400 mt-1">10/01/2024</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AppointmentSchedulePage;