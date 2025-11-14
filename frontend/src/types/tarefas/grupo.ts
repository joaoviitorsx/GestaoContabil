export type GrupoSetor = "Fiscal" | "Contábil" | "DP" | "Financeiro" | "Administrativo";

export interface Grupo {
  id: string;
  nome: string;
  descricao?: string;
  cor: string;
  dataCriacao: string;
  totalEmpresas: number;
  totalTarefas: number;
}

export interface GrupoStatistics {
  totalEmpresas: number;
  totalTarefas: number;
  tarefasConcluidas: number;
}
