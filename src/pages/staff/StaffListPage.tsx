import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { Search, Plus, Filter } from "lucide-react";
import { getStaff } from "../../services/staffService";
import type { Staff } from "../../lib/mock/data";

const StaffListPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStaff = async () => {
      try {
        setIsLoading(true);
        const data = await getStaff();
        setStaff(data);
        setError(null);
      } catch (err) {
        console.error("Error loading staff:", err);
        setError("Failed to load staff members. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadStaff();
  }, []);

  // Filter staff based on search query and active filter
  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      member.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.specialization &&
        member.specialization
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.phone &&
        member.phone.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter = !activeFilter || member.role === activeFilter;

    return matchesSearch && matchesFilter;
  });

  // Get unique roles for filtering
  const roles = Array.from(new Set(staff.map((member) => member.role)));

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case "doctor":
        return "Médico";
      case "nurse":
        return "Enfermeiro";
      case "technician":
        return "Técnico";
      default:
        return role;
    }
  };

  const handleViewProfile = (memberId: string) => {
    navigate(`/staff/${memberId}`);
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
          <h2 className="text-2xl font-bold text-gray-900">Equipe Médica</h2>
          <p className="text-gray-500">
            Gerencie os profissionais de saúde e funcionários
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => navigate("/staff/new")}
        >
          Novo Funcionário
        </Button>
      </div>

      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle>Lista de Funcionários</CardTitle>

            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <Input
                placeholder="Buscar por nome, especialidade..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
                className="w-full sm:w-64"
              />

              <div className="relative">
                <Button
                  variant="outline"
                  leftIcon={<Filter className="h-4 w-4" />}
                  className="sm:ml-2"
                >
                  Filtros
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <div className="px-4 py-2 border-b border-gray-200 overflow-x-auto">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveFilter(null)}
              className={`px-3 py-1 text-sm rounded-full ${
                activeFilter === null
                  ? "bg-blue-100 text-blue-800 font-medium"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Todos
            </button>

            {roles.map((role) => (
              <button
                key={role}
                onClick={() =>
                  setActiveFilter(activeFilter === role ? null : role)
                }
                className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${
                  activeFilter === role
                    ? "bg-blue-100 text-blue-800 font-medium"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {getRoleDisplay(role)}s
              </button>
            ))}
          </div>
        </div>

        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStaff.map((member) => (
              <div
                key={member.id}
                className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.full_name}
                        className="w-14 h-14 rounded-full object-cover border"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center">
                        <span className="text-lg font-semibold">
                          {member.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {member.full_name}
                      </h3>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Ativo
                      </span>
                    </div>

                    <p className="text-sm text-gray-600">
                      {getRoleDisplay(member.role)}
                      {member.specialization && ` • ${member.specialization}`}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      {member.registration_number}
                    </p>

                    <div className="mt-3 flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewProfile(String(member.id))}
                      >
                        Perfil
                      </Button>
                      <Button variant="outline" size="sm">
                        Agenda
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredStaff.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  Nenhum funcionário encontrado
                </h3>
                <p className="text-gray-500 max-w-md">
                  {searchQuery || activeFilter
                    ? "Não há funcionários que correspondam aos critérios de busca ou filtros aplicados."
                    : "Não há funcionários cadastrados no sistema."}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffListPage;
