import { useNavigate } from 'react-router-dom';
import TeleconsultationForm from '../../components/forms/TeleconsultationForm';
import { ChevronLeft } from 'lucide-react';
import Button from '../../components/ui/Button';

const NewTeleconsultationPage = () => {
  const navigate = useNavigate();
  
  const handleSuccess = () => {
    navigate('/telemedicine');
  };
  
  const handleCancel = () => {
    navigate('/telemedicine');
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
          <h2 className="text-2xl font-bold text-gray-900">Nova Teleconsulta</h2>
          <p className="text-gray-400">Agende uma nova teleconsulta</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center">
        <div className="max-w-4xl">
          <TeleconsultationForm 
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default NewTeleconsultationPage;