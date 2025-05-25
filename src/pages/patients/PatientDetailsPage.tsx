import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  FileText,
  Pill,
  Activity,
  ChevronLeft,
  Edit,
  Clipboard,
  Video,
  Plus
} from 'lucide-react';
import { getPatientById } from '../../lib/mock/api';
import type { Patient } from '../../lib/mock/data';

const PatientDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadPatient = async () => {
      if (id) {
        setIsLoading(true);
        const patientData = await getPatientById(id);
        setPatient(patientData);
        setIsLoading(false);
      }
    };
    
    loadPatient();
  }, [id]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-lg text-gray-600 mb-4">Paciente não encontrado</p>
        <Link to="/patients">
          <Button variant="outline" leftIcon={<ChevronLeft className="h-4 w-4" />}>
            Voltar para a lista de pacientes
          </Button>
        </Link>
      </div>
    );
  }
  
  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };
  
  return (
    <div className="space-y-6">
      {/* Header with back button and patient name */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-2">
          <Link to="/patients">
            <Button variant="outline" size="sm" leftIcon={<ChevronLeft className="h-4 w-4" />}>
              Voltar
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{patient.full_name}</h2>
            <p className="text-gray-500">Paciente #{patient.id}</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" leftIcon={<Edit className="h-4 w-4" />}>
            Editar
          </Button>
          <Button 
            variant="primary" 
            leftIcon={<Calendar className="h-4 w-4" />}
            onClick={() => navigate('/appointments/schedule')}
          >
            Agendar Consulta
          </Button>
        </div>
      </div>
      
      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Patient info */}
        <div className="space-y-6">
          {/* Patient summary card */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Paciente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-gray-500">Idade</div>
                <div className="text-sm text-gray-900">{calculateAge(patient.birth_date)} anos ({new Date(patient.birth_date).toLocaleDateString('pt-BR')})</div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-gray-500">Gênero</div>
                <div className="text-sm text-gray-900">
                  {patient.gender === 'male' ? 'Masculino' : 
                   patient.gender === 'female' ? 'Feminino' : 'Outro'}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-gray-500">CPF</div>
                <div className="text-sm text-gray-900">{patient.cpf}</div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-gray-500">Status</div>
                <div className="text-sm">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Ativo
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Contact information */}
          <Card>
            <CardHeader>
              <CardTitle>Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-900">{patient.phone || 'Não informado'}</div>
                  <div className="text-xs text-gray-500">Celular</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-900">{patient.email || 'Não informado'}</div>
                  <div className="text-xs text-gray-500">E-mail</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-900">{patient.address || 'Não informado'}</div>
                  <div className="text-xs text-gray-500">Endereço</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Middle column - Medical history */}
        <div className="space-y-6">
          {/* Health issues */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle>Condições de Saúde</CardTitle>
              <Button variant="ghost" size="sm" leftIcon={<Edit className="h-4 w-4" />}>
                Editar
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Alergias</h4>
                  <div className="flex flex-wrap gap-2">
                    <span 
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                    >
                      Nenhuma alergia registrada
                    </span>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Condições Crônicas</h4>
                  <div className="flex flex-wrap gap-2">
                    <span 
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800"
                    >
                      Nenhuma condição crônica registrada
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Medications */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle>Medicamentos Atuais</CardTitle>
              <Button variant="ghost" size="sm" leftIcon={<Edit className="h-4 w-4" />}>
                Editar
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div 
                  className={`flex items-start p-3 rounded-md border`}
                >
                  Nenhum medicamento registrado
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Exams */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle>Exames Recentes</CardTitle>
              <Button variant="ghost" size="sm">Ver Todos</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div 
                  className="flex items-start p-3 rounded-md border hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Nenhum exame registrado
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button variant="outline" fullWidth leftIcon={<Clipboard className="h-4 w-4" />}>
                Solicitar Novo Exame
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Right column - Appointments and actions */}
        <div className="space-y-6">
          {/* Upcoming appointments */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-6 text-center">
                <p className="text-gray-500 mb-4">O que você gostaria de fazer?</p>
                <div className="grid grid-cols-1 gap-2 mt-4">
                  <Button 
                    variant="outline"
                    leftIcon={<Calendar className="h-4 w-4" />}
                    onClick={() => navigate('/appointments/schedule')}
                  >
                    Agendar Consulta
                  </Button>
                  <Button 
                    variant="primary"
                    leftIcon={<Plus className="h-4 w-4" />}
                    onClick={() => navigate(`/patients/${patient.id}/prescriptions/new`)}
                  >
                    Emitir Prescrição
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailsPage;