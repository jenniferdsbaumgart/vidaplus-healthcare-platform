import { useParams, useNavigate } from "react-router-dom";
import ExamForm from "../../components/forms/ExamForm";
import { ChevronLeft } from "lucide-react";
import Button from "../../components/ui/Button";

const NewExamPage = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();

  if (!patientId) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-lg text-gray-600 mb-4">
          ID do paciente não fornecido
        </p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Voltar
        </Button>
      </div>
    );
  }

  const handleSuccess = () => {
    navigate(`/patients/${patientId}`);
  };

  const handleCancel = () => {
    navigate(`/patients/${patientId}`);
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
          <h2 className="text-2xl font-bold text-gray-900">Solicitar Exame</h2>
          <p className="text-gray-500">
            Preencha os dados para solicitar um novo exame
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center">
        <div className="w-[900px] max-w-4xl">
          <ExamForm
            patientId={patientId}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default NewExamPage;
