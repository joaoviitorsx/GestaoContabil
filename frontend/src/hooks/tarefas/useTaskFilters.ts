import { useState, useCallback } from "react";
import type { TaskFilters } from "../../types/tarefas/filters";
import type { TaskStatus } from "../../types/workspace/task";

export function useTaskFilters() {
  const [filters, setFilters] = useState<TaskFilters>({
    searchTerm: "",
    responsible: "",
    setor: "",
    status: "",
    filial: "",
  });

  const updateSearchTerm = useCallback((searchTerm: string) => {
    setFilters((prev) => ({ ...prev, searchTerm }));
  }, []);

  const updateResponsible = useCallback((responsible: string) => {
    setFilters((prev) => ({ ...prev, responsible }));
  }, []);

  const updateSetor = useCallback((setor: string) => {
    setFilters((prev) => ({ ...prev, setor }));
  }, []);

  const updateStatus = useCallback((status: TaskStatus | "") => {
    setFilters((prev) => ({ ...prev, status }));
  }, []);

  const updateFilial = useCallback((filial: string) => {
    setFilters((prev) => ({ ...prev, filial }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      searchTerm: "",
      responsible: "",
      setor: "",
      status: "",
      filial: "",
    });
  }, []);

  const hasActiveFilters = useCallback(() => {
    return Object.values(filters).some((value) => value !== "");
  }, [filters]);

  return {
    filters,
    updateSearchTerm,
    updateResponsible,
    updateSetor,
    updateStatus,
    updateFilial,
    clearFilters,
    hasActiveFilters,
  };
}
