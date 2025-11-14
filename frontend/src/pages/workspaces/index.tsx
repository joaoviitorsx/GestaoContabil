import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import MainLayout from "../../layouts/MainLayout";
import { workspacesMock } from "../../mock/workspaces";
import WorkspaceCard from "../../components/workspace/WorkspaceCard";

function WorkspacesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredWorkspaces = useMemo(() => {
    if (!searchTerm.trim()) return workspacesMock;
    const search = searchTerm.toLowerCase();
    return workspacesMock.filter(
      (workspace) =>
        workspace.nomeFantasia.toLowerCase().includes(search) ||
        workspace.razaoSocial.toLowerCase().includes(search) ||
        workspace.cnpj.includes(search)
    );
  }, [searchTerm]);

  const getSetorColor = (setor: string) => {
    const colors: Record<string, string> = {
      Fiscal: "bg-blue-100 text-blue-700 border-blue-200",
      Contábil: "bg-green-100 text-green-700 border-green-200",
      DP: "bg-purple-100 text-purple-700 border-purple-200",
      Financeiro: "bg-orange-100 text-orange-700 border-orange-200",
      Administrativo: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return colors[setor] || colors.Administrativo;
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <header className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
              Empresas
            </h1>
            <p className="text-gray-500 text-base">
              Gerencie todas as tarefas para cada empresa 
            </p>
          </div>

          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por razão social, nome fantasia ou CNPJ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredWorkspaces.map((workspace) => (
            <WorkspaceCard
              key={workspace.id}
              workspace={workspace}
              onClick={() => navigate(`/workspaces/${workspace.id}`)}
              getSetorColor={getSetorColor}
            />
          ))}
        </div>

        {filteredWorkspaces.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Nenhuma empresa encontrada</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default WorkspacesPage;