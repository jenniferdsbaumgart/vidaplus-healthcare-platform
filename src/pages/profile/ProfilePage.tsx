import { useAuth } from '../../hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { User, Mail, Phone, Shield, Key, BellRing, Save } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Meu Perfil</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Profile info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                      {user?.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-full h-full text-gray-500 p-4" />
                      )}
                    </div>
                    <button className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 shadow-md hover:bg-blue-700 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4 flex-grow">
                  <Input
                    label="Nome Completo"
                    defaultValue={user?.name}
                    leftIcon={<User className="h-5 w-5" />}
                    fullWidth
                  />
                  
                  <Input
                    label="E-mail"
                    type="email"
                    defaultValue={user?.email}
                    leftIcon={<Mail className="h-5 w-5" />}
                    fullWidth
                  />
                  
                  <Input
                    label="Telefone"
                    defaultValue="(11) 98765-4321"
                    leftIcon={<Phone className="h-5 w-5" />}
                    fullWidth
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-4">
              <Button 
                variant="primary"
                leftIcon={<Save className="h-4 w-4" />}
              >
                Salvar Alterações
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Alterar Senha</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Senha Atual"
                type="password"
                leftIcon={<Key className="h-5 w-5" />}
                fullWidth
              />
              
              <Input
                label="Nova Senha"
                type="password"
                leftIcon={<Key className="h-5 w-5" />}
                fullWidth
                helperText="A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas e números."
              />
              
              <Input
                label="Confirmar Nova Senha"
                type="password"
                leftIcon={<Key className="h-5 w-5" />}
                fullWidth
              />
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-4">
              <Button 
                variant="primary"
              >
                Atualizar Senha
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Right column - Additional settings */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalhes da Conta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-gray-500">Função</div>
                <div className="text-sm font-medium capitalize">{user?.role}</div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-gray-500">ID do Usuário</div>
                <div className="text-sm text-gray-900">{user?.id}</div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-gray-500">Data de Criação</div>
                <div className="text-sm text-gray-900">15/01/2023</div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-gray-500">Último Acesso</div>
                <div className="text-sm text-gray-900">Hoje, 09:45</div>
              </div>
              
              <div className="pt-3 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-900 mb-2">Permissões</p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm text-gray-600">Acesso ao módulo de Pacientes</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm text-gray-600">Acesso ao módulo de Telemedicina</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm text-gray-600">Acesso ao módulo de Prontuários</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <BellRing className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Consultas e Agendamentos</p>
                      <p className="text-xs text-gray-500">Receba notificações sobre consultas marcadas</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <BellRing className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Resultados de Exames</p>
                      <p className="text-xs text-gray-500">Notificações quando exames estiverem disponíveis</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <BellRing className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Atualizações do Sistema</p>
                      <p className="text-xs text-gray-500">Notificações sobre novos recursos</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <BellRing className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">E-mails Promocionais</p>
                      <p className="text-xs text-gray-500">Receba novidades e ofertas</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-4">
              <Button 
                variant="primary"
              >
                Salvar Preferências
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;