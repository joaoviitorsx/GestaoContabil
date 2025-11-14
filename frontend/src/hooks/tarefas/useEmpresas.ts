import { useMemo } from "react";
import { workspacesMock } from "../../mock/workspaces";
import { gruposMock } from "../../mock/grupos";
import type { Workspace } from "../../types/workspace/workspace";
import type { Grupo } from "../../types/tarefas/grupo";

interface UseEmpresasParams {
  grupoId?: string;
  searchTerm?: string;
}

interface UseEmpresasReturn {
  grupo: Grupo | undefined;
  empresas: Workspace[];
  empresasFiltradas: Workspace[];
  totalEmpresas: number;
  hasEmpresas: boolean;
}

export function useEmpresas({
  grupoId,
  searchTerm = "",
}: UseEmpresasParams): UseEmpresasReturn {
  // Buscar o grupo
  const grupo = useMemo(() => {
    return gruposMock.find((g) => g.id === grupoId);
  }, [grupoId]);

  // Filtrar empresas do grupo
  const empresas = useMemo(() => {
    if (!grupoId) return [];
    return workspacesMock.filter((w) => w.grupoId === grupoId);
  }, [grupoId]);

  // Filtrar por busca
  const empresasFiltradas = useMemo(() => {
    if (!searchTerm) return empresas;

    const term = searchTerm.toLowerCase();
    return empresas.filter(
      (empresa) =>
        empresa.nomeFantasia.toLowerCase().includes(term) ||
        empresa.razaoSocial.toLowerCase().includes(term) ||
        empresa.cnpj.includes(term)
    );
  }, [empresas, searchTerm]);

  return {
    grupo,
    empresas,
    empresasFiltradas,
    totalEmpresas: empresas.length,
    hasEmpresas: empresas.length > 0,
  };
}
