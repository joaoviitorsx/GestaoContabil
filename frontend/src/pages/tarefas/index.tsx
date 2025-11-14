import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { gruposMock } from "../../mock/grupos";
import GruposList from "../../components/tarefas/grupos/GruposList";
import GrupoFilters from "../../components/tarefas/grupos/GrupoFilters";
import type { Grupo } from "../../types/tarefas/grupo";

export default function GruposPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const gruposFiltrados = gruposMock.filter((grupo: Grupo) =>
    grupo.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grupo.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectGrupo = (grupoId: string) => {
    navigate(`/tarefas/empresas/${grupoId}`);
  };

  return (
    <MainLayout>
      <div className="mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Gestão de Tarefas</h1>
          <p className="text-gray-500 text-base mt-2">
            Organize suas empresas por grupos e gerencie tarefas de forma eficiente.
          </p>
        </header>

        <div className="space-y-6">
          <GrupoFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            hasActiveFilters={false}
            onClearFilters={() => {}}
          />

          <GruposList
            grupos={gruposFiltrados}
            onSelectGrupo={handleSelectGrupo}
            emptyMessage={
              searchTerm
                ? "Nenhum grupo encontrado com esse termo"
                : "Nenhum grupo cadastrado ainda"
            }
          />
        </div>
      </div>
    </MainLayout>
  );
}