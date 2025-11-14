import type { TaskStatus } from "../workspace/task";
import type { GrupoSetor } from "./grupo";

export interface WorkspaceFilters {
  searchTerm: string;
  setor: GrupoSetor | "";
}

export interface TaskFilters {
  searchTerm: string;
  responsible: string;
  setor: string;
  status: TaskStatus | "";
  filial: string;
}

export interface FilterOption {
  value: string;
  label: string;
}
