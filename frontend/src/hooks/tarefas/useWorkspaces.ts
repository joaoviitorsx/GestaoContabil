import { useMemo } from "react";
import type { Workspace } from "../../types/workspace/workspace";
import type { WorkspaceFilters } from "../../types/tarefas/filters";

export function useWorkspaces(workspaces: Workspace[], filters: WorkspaceFilters) {
  const filteredWorkspaces = useMemo(() => {
    let result = workspaces;

    // Filtro de busca
    if (filters.searchTerm.trim()) {
      const search = filters.searchTerm.toLowerCase();
      result = result.filter(
        (workspace) =>
          workspace.nomeFantasia.toLowerCase().includes(search) ||
          workspace.razaoSocial.toLowerCase().includes(search) ||
          workspace.cnpj.includes(search)
      );
    }

    // Filtro de setor
    if (filters.setor) {
      result = result.filter((workspace) => workspace.setor === filters.setor);
    }

    return result;
  }, [workspaces, filters]);

  const statistics = useMemo(() => {
    return {
      total: filteredWorkspaces.length,
      totalTasks: filteredWorkspaces.reduce((acc, w) => acc + w.totalTasks, 0),
      averageCompletion:
        filteredWorkspaces.length > 0
          ? Math.round(
              filteredWorkspaces.reduce((acc, w) => acc + w.completionRate, 0) /
                filteredWorkspaces.length
            )
          : 0,
    };
  }, [filteredWorkspaces]);

  return {
    workspaces: filteredWorkspaces,
    statistics,
  };
}
