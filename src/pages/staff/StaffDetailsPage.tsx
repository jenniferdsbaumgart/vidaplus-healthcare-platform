import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import {
  Phone,
  Mail,
  Calendar,
  Clock,
  FileText,
  ChevronLeft,
  Edit,
  Download,
  Printer,
  Users,
  Building,
  GraduationCap,
  Briefcase,
  CalendarRange,
  BarChart,
  Activity,
  Video
} from 'lucide-react';
import { getStaffById } from '../../services/staffService';
import { StaffData } from "../../lib/types/staff";

const StaffDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [staff, setStaff] = useState<StaffData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadStaff = async () => {
      if (id) {
        setIsLoading(true);
        const staffData = await getStaffById(Number(id));
        setStaff(staffData);
        setIsLoading(false);
      }
    };
    
    loadStaff();
  }, [id]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!staff) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-lg text-gray-600 mb-4">Funcionário não encontrado</p>
        <Link to="/staff">
          <Button variant="outline" leftIcon={<ChevronLeft className="h-4 w-4" />}>
            Voltar para a lista de funcionários
          </Button>
        </Link>
      </div>
    );
  }

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'doctor':
        return 'Médico';
      case 'nurse':
        return 'Enfermeiro';
      case 'technician':
        return 'Técnico';
      default:
        return role;
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-2">
          <Link to="/staff">
            <Button variant="outline" size="sm" leftIcon={<ChevronLeft className="h-4 w-4" />}>
              Voltar
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{staff.full_name}</h2>
            <p className="text-gray-500">{getRoleDisplay(staff.role)} • {staff.registration_number}</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            leftIcon={<Download className="h-4 w-4" />}
            onClick={() => window.print()}
          >
            Exportar
          </Button>
          <Button 
            variant="outline" 
            leftIcon={<Printer className="h-4 w-4" />}
            onClick={() => window.print()}
          >
            Imprimir
          </Button>
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
        {/* Left column - Basic info */}
        <div className="space-y-6">
          {/* Profile card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="flex-shrink-0 mr-4">
                    {staff.avatar ? (
                      <img
                        src={staff.avatar}
                        alt={staff.full_name}
                        className="w-14 h-14 rounded-full object-cover border"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center">
                        <span className="text-lg font-semibold">
                          {staff.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                    )}
                  </div>
                <h3 className="text-xl font-semibold text-gray-900">{staff.full_name}</h3>
                <p className="text-gray-500">{getRoleDisplay(staff.role)}</p>
                <div className="mt-2">
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
              <CardTitle>Informações de Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-900">{staff.email}</div>
                  <div className="text-xs text-gray-500">E-mail</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-900">{staff.phone || 'Não informado'}</div>
                  <div className="text-xs text-gray-500">Telefone</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <Building className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Unidade Central</div>
                  <div className="text-xs text-gray-500">Localização</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Professional information */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Profissionais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <GraduationCap className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-900">{staff.registration_number}</div>
                  <div className="text-xs text-gray-500">Registro Profissional</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <Briefcase className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-900">{staff.specialization || 'Não informado'}</div>
                  <div className="text-xs text-gray-500">Especialização</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <CalendarRange className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {new Date(staff.created_at).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="text-xs text-gray-500">Data de Admissão</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Middle column - Schedule and activities */}
        <div className="space-y-6">
          {/* Schedule */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle>Horários de Atendimento</CardTitle>
              <Button variant="ghost" size="sm" leftIcon={<Edit className="h-4 w-4" />}>
                Editar
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-900">Segunda a Sexta</p>
                    <p className="text-sm text-gray-500">08:00 - 17:00</p>
                  </div>
                  <div className="p-3 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-900">Sábado</p>
                    <p className="text-sm text-gray-500">08:00 - 12:00</p>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Intervalos</h4>
                  <p className="text-sm text-gray-500">Almoço: 12:00 - 13:00</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Recent activities */}
          <Card>
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative pl-6 pb-4 border-l-2 border-gray-200">
                  <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-teal-800"></div>
                  <p className="text-sm font-medium text-gray-900">Consulta realizada</p>
                  <p className="text-xs text-gray-500 mt-1">Atendimento ao paciente João Silva</p>
                  <p className="text-xs text-gray-400 mt-1">Há 35 minutos</p>
                </div>
                
                <div className="relative pl-6 pb-4 border-l-2 border-gray-200">
                  <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-teal-600"></div>
                  <p className="text-sm font-medium text-gray-900">Prescrição emitida</p>
                  <p className="text-xs text-gray-500 mt-1">Medicação prescrita para Maria Santos</p>
                  <p className="text-xs text-gray-400 mt-1">Há 2 horas</p>
                </div>
                
                <div className="relative pl-6">
                  <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-teal-500"></div>
                  <p className="text-sm font-medium text-gray-900">Exame solicitado</p>
                  <p className="text-xs text-gray-500 mt-1">Hemograma completo para Pedro Oliveira</p>
                  <p className="text-xs text-gray-400 mt-1">Há 4 horas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right column - Performance and stats */}
        <div className="space-y-6">
          {/* Performance metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Métricas de Desempenho</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <Users className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">127</p>
                  <p className="text-sm text-gray-500">Pacientes Atendidos</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <Activity className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">98%</p>
                  <p className="text-sm text-gray-500">Taxa de Satisfação</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <Clock className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">25min</p>
                  <p className="text-sm text-gray-500">Tempo Médio</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <BarChart className="h-6 w-6 text-amber-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">95%</p>
                  <p className="text-sm text-gray-500">Produtividade</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Upcoming schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Próximos Atendimentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start p-3 rounded-md border hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Consulta com Maria Silva</p>
                    <p className="text-xs text-gray-500 mt-1">Hoje, 14:30</p>
                  </div>
                </div>
                
                <div className="flex items-start p-3 rounded-md border hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <Video className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Teleconsulta com João Santos</p>
                    <p className="text-xs text-gray-500 mt-1">Hoje, 15:45</p>
                  </div>
                </div>
                
                <div className="flex items-start p-3 rounded-md border hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Retorno de Ana Costa</p>
                    <p className="text-xs text-gray-500 mt-1">Amanhã, 09:15</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" size="sm" leftIcon={<ChevronLeft className="h-4 w-4" />}>
                Ver Todos
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StaffDetailsPage;