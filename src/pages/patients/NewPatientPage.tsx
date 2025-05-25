import React from 'react';
import { useNavigate } from 'react-router-dom';
import PatientForm from '../../components/forms/PatientForm';
import { ChevronLeft } from 'lucide-react';
import Button from '../../components/ui/Button';

const NewPatientPage = () => {
  const navigate = useNavigate();
  
  const handleSuccess = () => {
    navigate('/patients');
  };
  
  const handleCancel = () => {
    navigate('/patients');
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
          <h2 className="text-2xl font-bold text-gray-900">Novo Paciente</h2>
          <p className="text-gray-500">Cadastre um novo paciente no sistema</p>
        </div>
      </div>
      
      <div className="max-w-2xl">
        <PatientForm 
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default NewPatientPage;