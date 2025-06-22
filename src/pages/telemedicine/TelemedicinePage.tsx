import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Search, Video, Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { getTeleconsultations } from '../../services/telemedicineService';

interface Teleconsultation {
  id: number;
  date: string;
  scheduled_for: string;
  notes?: string;
  patient: {
    id: number;
    full_name: string;
    birth_date: string;
  };
  staff: {
    id: number;
    full_name: string;
    specialization: string;
  };
}

const TelemedicinePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [teleconsultations, setTeleconsultations] = useState<Teleconsultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  const currentDateStr = formatDate(currentDate);

  useEffect(() => {
    const loadTeleconsultations = async () => {
      try {
        setIsLoading(true);
        const data = await getTeleconsultations(currentDateStr);
        setTeleconsultations(data);
        setError(null);
      } catch (err) {
        console.error('Error loading teleconsultations:', err);
        setError('Failed to load teleconsultations. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadTeleconsultations();
  }, [currentDateStr]);

  const filteredConsultations = teleconsultations.filter((consultation) =>
    consultation.patient.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    consultation.staff.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const goToPreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const formatDateForDisplay = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  const capitalizeFirstLetter = (string: string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  const displayDate = capitalizeFirstLetter(formatDateForDisplay(currentDate));

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

  const isWithin15Minutes = (scheduledFor: string) => {
    const now = new Date();
    const consultationDate = new Date(scheduledFor);
    const timeDiff = (consultationDate.getTime() - now.getTime()) / (1000 * 60);
    return timeDiff >= -15 && timeDiff <= 15;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-error mb-4">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Tentar Novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Telemedicina</h2>
          <p className="text-gray-500">Gerencie e realize consultas remotas</p>
        </div>

        <Button
          variant="primary"
          leftIcon={<Calendar className="h-4 w-4" />}
          onClick={() => navigate('/telemedicine/new')}
        >
          Agendar Teleconsulta
        </Button>
      </div>

      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center space-x-2">
              <CardTitle>Teleconsultas</CardTitle>
              <span className="text-sm text-gray-500">{displayDate}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <div className="flex">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousDay}
                  leftIcon={<ChevronLeft className="h-4 w-4" />}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextDay}
                  rightIcon={<ChevronRight className="h-4 w-4" />}
                  className="ml-2"
                >
                  Próximo
                </Button>
              </div>

              <Input
                placeholder="Buscar paciente ou médico..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
                className="w-full sm:w-64 sm:ml-2"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4 mt-2">
            {filteredConsultations.length > 0 ? (
              filteredConsultations.map((consultation) => (
                <div
                  key={consultation.id}
                  className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center mb-3 md:mb-0">
                    <div className="relative mr-4">
                      <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center">
                        <span className="text-lg font-semibold">
                          {consultation.patient.full_name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-white" />
                    </div>

                    <div>
                      <div className="flex items-center">
                        <Link
                          to={`/patients/${consultation.patient.id}`}
                          className="text-teal-600 hover:text-teal-800 hover:underline text-sm font-medium"
                        >
                          {consultation.patient.full_name}
                        </Link>
                        <span className="ml-2 text-xs text-gray-500">
                          {calculateAge(consultation.patient.birth_date)} anos
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {consultation.staff.specialization} com {consultation.staff.full_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full md:w-auto">
                    <div className="flex items-center text-gray-600 bg-gray-100 px-3 py-1.5 rounded-md text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>
                        {new Date(consultation.scheduled_for).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <span className="mx-1">•</span>
                      <span>30 min</span>
                    </div>

                    <Button
                      variant="primary"
                      leftIcon={<Video className="h-4 w-4" />}
                      disabled={!isWithin15Minutes(consultation.scheduled_for)}
                      className="w-full sm:w-auto"
                    >
                      {isWithin15Minutes(consultation.scheduled_for)
                        ? 'Iniciar Agora'
                        : 'Iniciar Consulta'}
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-3 bg-blue-50 rounded-full mb-4">
                  <Video className="h-10 w-10 text-teal-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  Nenhuma teleconsulta encontrada
                </h3>
                <p className="text-gray-500 max-w-md mb-6">
                  {searchQuery
                    ? 'Não há teleconsultas que correspondam aos critérios de busca para este dia.'
                    : 'Não há teleconsultas agendadas para este dia.'}
                </p>
                <Button
                  variant="outline"
                  leftIcon={<Calendar className="h-4 w-4" />}
                  onClick={() => navigate('/telemedicine/new')}
                >
                  Agendar Nova Teleconsulta
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TelemedicinePage;
