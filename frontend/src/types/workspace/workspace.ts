import type { Task } from "./task";
import type { AccessLink } from "./accessLink";
import type { Credential } from "./credential";
import type { Document } from "./document";

export type Setor = "Fiscal" | "Contábil" | "DP" | "Financeiro" | "Administrativo";
export type SituacaoEmpresa = "Ativa" | "Em Rescisão" | "Baixada";
export type RegimeTributario = "Simples Nacional" | "Lucro Presumido" | "Lucro Real";
export type Classe = "A" | "B" | "C";
export type StatusSetor = "Ativo" | "Inativo" | "Em Implantação";

export interface Filial {
  id: string;
  name: string;
  cnpj: string;
  address: string;
  phone: string;
  email: string;
  manager?: string;
  active: boolean;
}

// Informações específicas para cada situação da empresa
export interface SituacaoAtiva {
  procuracaoDET: string; // Data ou status
  apresentacao: string; // Data ou status
  encerramentoInter: string; // Data ou status
}

export interface SituacaoEmRescisao {
  statusRescisao: string;
  dataRescisao: string;
  contratos: string;
  procuracao: string;
  det: string;
  observacaoRescisao: string;
}

export interface SituacaoBaixada {
  statusFinal: string;
  dataBaixa: string;
  contratosEncerramento: string;
  procuracao: string;
  statusDBE: string; // Documento Básico de Entrada
}

// Informações de responsável por setor
export interface SetorInfo {
  responsavel: string;
  status: StatusSetor;
  classe: Classe;
}

export interface Workspace {
  id: string;
  grupoId?: string; // ID do grupo ao qual a empresa pertence
  
  // Campos Padrão
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  grupo?: string; // Nome do grupo
  regimeTributario: RegimeTributario;
  inicioContrato: string; // Data em formato ISO

  // Situação da Empresa
  situacao: SituacaoEmpresa;
  situacaoAtiva?: SituacaoAtiva;
  situacaoEmRescisao?: SituacaoEmRescisao;
  situacaoBaixada?: SituacaoBaixada;

  // Atribuição dos Setores (opcional)
  setorContabil?: SetorInfo;
  setorFiscal?: SetorInfo;
  setorDP?: SetorInfo;

  setor: Setor;
  icon: string;
  color: string;

  totalTasks: number;
  completionRate: number;

  tasksByStatus: {
    todo: number;
    "in-progress": number;
    "in-review": number;
    done: number;
  };

  filiais: Filial[];
  tasks: Task[];
  accessLinks: AccessLink[];
  credentials: Credential[];
  documents: Document[];

  contact: {
    email: string;
    phone: string;
    address: string;
  };
}

export interface WorkspaceCardProps {
  workspace: Workspace;
  onClick: () => void;
  getSetorColor: (setor: string) => string;
}
