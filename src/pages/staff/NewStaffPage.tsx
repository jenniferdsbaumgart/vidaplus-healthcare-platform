import { useNavigate } from 'react-router-dom';
import StaffForm from '../../components/forms/StaffForm';
import { ChevronLeft } from 'lucide-react';
import Button from '../../components/ui/Button';

const NewStaffPage = () => {
  const navigate = useNavigate();
  
  const handleSuccess = () => {
    navigate('/staff');
  };
  
  const handleCancel = () => {
    navigate('/staff');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          leftIcon={<ChevronLeft className="h-4 w-4" />}
          onClick={handleCancel}
        >
          Voltar
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Novo Profissional</h2>
          <p className="text-gray-500">Cadastre um novo profissional de saúde</p>
        </div>
      </div>
      
      <div className="flex flex-col items-center justify-center">
        <div className="max-w-6xl">
          <StaffForm 
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default NewStaffPage;