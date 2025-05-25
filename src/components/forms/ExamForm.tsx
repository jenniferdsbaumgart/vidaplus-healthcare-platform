import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EXAM_TYPES } from "../../lib/mock/data";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/Card";
import { FileText, AlertTriangle, Calendar } from "lucide-react";
import { ExamFormData, examSchema } from "../../lib/validations/exam";
import type { OptionHTMLAttributes } from "react";

interface ExamFormProps {
  patientId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ExamForm = ({ patientId, onSuccess, onCancel }: ExamFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ExamFormData>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      patient_id: patientId,
      fasting_required: false,
    },
  });

  const onSubmit = async (data: ExamFormData) => {
    try {
      await createExam(data);
      reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error creating exam request:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Solicitar Novo Exame</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-3" />
              <div>
                <h4 className="text-sm font-medium text-amber-800">
                  Atenção ao Solicitar
                </h4>
                <ul className="mt-2 text-sm text-amber-700 space-y-1">
                  <li>• Verifique se o exame é realmente necessário</li>
                  <li>• Considere exames recentes do paciente</li>
                  <li>• Forneça todas as informações relevantes</li>
                </ul>
              </div>
            </div>
          </div>

          <Select
            label="Tipo de Exame"
            error={errors.exam_type?.message}
            {...register("exam_type")}
            required
            fullWidth
          >
            <option value="">Selecione um tipo de exame</option>
            {EXAM_TYPES.filter(
              (type): type is string => typeof type === "string" && type !== ""
            ).map(
              (
                type: string
              ): React.ReactElement<
                OptionHTMLAttributes<HTMLOptionElement>
              > => (
                <option key={type} value={type}>
                  {type}
                </option>
              )
            )}
          </Select>

          <Select
            label="Urgência"
            error={errors.urgency?.message}
            {...register("urgency")}
            required
            fullWidth
          >
            <option value="">Selecione o nível de urgência</option>
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
          </Select>

          <Textarea
            label="Motivo do Exame"
            error={errors.reason?.message}
            {...register("reason")}
            placeholder="Descreva o motivo da solicitação do exame..."
            required
            fullWidth
          />

          <Input
            type="date"
            label="Data Sugerida"
            leftIcon={<Calendar className="h-5 w-5" />}
            error={errors.scheduled_date?.message}
            {...register("scheduled_date")}
            fullWidth
            optional
          />

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="fasting_required"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                {...register("fasting_required")}
              />
              <label
                htmlFor="fasting_required"
                className="text-sm font-medium text-gray-700"
              >
                Jejum Necessário
              </label>
            </div>

            <Textarea
              label="Instruções Especiais"
              error={errors.special_instructions?.message}
              {...register("special_instructions")}
              placeholder="Instruções específicas para a realização do exame..."
              fullWidth
              optional
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end space-x-4 border-t">
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          )}

          <Button
            type="submit"
            variant="primary"
            leftIcon={<FileText className="h-4 w-4" />}
            isLoading={isSubmitting}
          >
            Solicitar Exame
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

async function createExam(data: {
    patient_id: string;
    exam_type: string;
    urgency: "low" | "medium" | "high";
    reason: string;
    fasting_required: boolean;
    scheduled_date?: string | undefined;
    special_instructions?: string | undefined;
}) {
    const response = await fetch("/api/exams", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Failed to create exam request");
    }

    return response.json();
}

export default ExamForm;

