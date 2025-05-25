import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Search, Video, Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { getTeleconsultations } from '../../lib/api/teleconsultations';
import type { Database } from '../../lib/types/supabase';

type Teleconsultation = Database['public']['Tables']['teleconsultations']['Row'] & {
  patient: Database['public']['Tables']['patients']['Row'];
  staff: Database['public']['Tables']['staff']['Row'];
};

const TelemedicinePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [teleconsultations, setTeleconsultations] = useState<Teleconsultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Format the date for display and filtering
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  
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
  
  // Filter teleconsultations based on search query
  const filteredConsultations = teleconsultations.filter(consultation => 
    consultation.patient.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    consultation.staff.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Go to the previous or next day
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
  
  // Format the date for display in the UI
  const formatDateForDisplay = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };
  
  // Capitalize first letter of the formatted date
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  
  const displayDate = capitalizeFirstLetter(formatDateForDisplay(currentDate));
  
  // Calculate age from birth_date
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
  
  // Check if a time is within 15 minutes from now (for the "Join Now" button)
  const isWithin15Minutes = (scheduledFor: string) => {
    const now = new Date();
    const consultationDate = new Date(scheduledFor);
    const timeDiff = (consultationDate.getTime() - now.getTime()) / (1000 * 60); // Difference in minutes
    
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
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
        >
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
              <span className="text-sm text-gray-500">
                {displayDate}
              </span>
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
                          {consultation.patient.full_name.split(' ').map(n => n[0]).join('')}
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
                      <span>{new Date(consultation.scheduled_for).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="mx-1">•</span>
                      <span>30 min</span>
                    </div>
                    
                    <Button 
                      variant="primary"
                      leftIcon={<Video className="h-4 w-4" />}
                      disabled={!isWithin15Minutes(consultation.scheduled_for)}
                      className="w-full sm:w-auto"
                    >
                      {isWithin15Minutes(consultation.scheduled_for) ? 'Iniciar Agora' : 'Iniciar Consulta'}
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-3 bg-blue-50 rounded-full mb-4">
                  <Video className="h-10 w-10 text-teal-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhuma teleconsulta encontrada</h3>
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Como Funciona a Telemedicina</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Preparação para a Consulta</h3>
              <ul className="text-sm text-blue-800 space-y-2 pl-5 list-disc">
                <li>Verifique sua conexão com a internet</li>
                <li>Teste sua câmera e microfone</li>
                <li>Escolha um local calmo e bem iluminado</li>
                <li>Tenha em mãos seus documentos e histórico médico</li>
              </ul>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <h3 className="text-sm font-medium text-green-900 mb-2">Durante a Consulta</h3>
              <ul className="text-sm text-green-800 space-y-2 pl-5 list-disc">
                <li>Fale claramente e descreva seus sintomas em detalhes</li>
                <li>Mostre à câmera qualquer área afetada, se necessário</li>
                <li>Anote as recomendações do médico</li>
                <li>Pergunte sobre prescrições e encaminhamentos</li>
              </ul>
            </div>
            
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
              <h3 className="text-sm font-medium text-amber-900 mb-2">Após a Consulta</h3>
              <ul className="text-sm text-amber-800 space-y-2 pl-5 list-disc">
                <li>Verifique suas prescrições no sistema</li>
                <li>Agende exames recomendados</li>
                <li>Confirme sua próxima consulta, se necessário</li>
                <li>Avalie a qualidade da teleconsulta</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Próximas Teleconsultas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teleconsultations
                .filter(c => new Date(c.scheduled_for) > new Date())
                .slice(0, 3)
                .map((consultation) => (
                  <div
                    key={consultation.id}
                    className="flex items-start p-3 rounded-md border hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center mr-3">
                      <span className="text-sm font-semibold">
                        {consultation.patient.full_name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <Link 
                          to={`/patients/${consultation.patient.id}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium"
                        >
                          {consultation.patient.full_name}
                        </Link>
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(consultation.scheduled_for).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-gray-500">
                          {consultation.staff.specialization} • {consultation.staff.full_name}
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(consultation.scheduled_for).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              
              {teleconsultations.filter(c => new Date(c.scheduled_for) > new Date()).length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  Não há teleconsultas futuras agendadas.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TelemedicinePage;