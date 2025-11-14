import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { useEmpresas } from "../../hooks/tarefas/useEmpresas";
import EmpresasHeader from "../../components/tarefas/empresas/EmpresasHeader";
import EmpresasList from "../../components/tarefas/empresas/EmpresasList";

export default function EmpresasPage() {
  const { grupoId } = useParams<{ grupoId: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const { grupo, empresasFiltradas, totalEmpresas } = useEmpresas({
    grupoId,
    searchTerm,
  });

  const handleSelectEmpresa = (empresaId: string) => {
    navigate(`/tarefas/painel/${grupoId}/${empresaId}`);
  };

  const handleBack = () => {
    navigate("/tarefas");
  };

  if (!grupo) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-800 mb-2">Grupo não encontrado</p>
            <button onClick={handleBack} className="text-blue-600 hover:text-blue-700 font-medium">
              Voltar para grupos
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <EmpresasHeader
          grupo={grupo}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onBack={handleBack}
          totalEmpresas={totalEmpresas}
        />

        <EmpresasList
          empresas={empresasFiltradas}
          onSelectEmpresa={handleSelectEmpresa}
          emptyMessage={
            searchTerm
              ? "Nenhuma empresa encontrada com esse termo"
              : "Nenhuma empresa cadastrada neste grupo"
          }
        />
      </div>
    </MainLayout>
  );
}