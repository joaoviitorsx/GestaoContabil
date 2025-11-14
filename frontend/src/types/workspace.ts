export type TaskStatus = 'backlog' | 'in-progress' | 'in-review' | 'done';
export type Setor = 'Fiscal' | 'Contábil' | 'DP' | 'Financeiro' | 'Administrativo';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  setor: Setor;
  filial?: string;
  responsible: {
    name: string;
    role: string;
    avatar?: string;
  };
  dueDate: string;
  isLate?: boolean;
  attachments?: number;
  comments?: number;
  links?: number;
  createdAt: string;
  updatedAt: string;
  accessLinkIds?: string[];
  attachmentIds?: string[];
}

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

export interface AccessLink {
  id: string;
  name: string;
  url: string;
  icon: string;
  description?: string;
  category?: string;
}

export interface Credential {
  id: string;
  system: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
  icon?: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  uploadedBy: string;
  url: string;
}

export interface Workspace {
  id: string;
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
  setor: Setor;
  icon: string;
  color: string;
  totalTasks: number;
  completionRate: number;
  tasksByStatus: {
    todo: number;
    'in-progress': number;
    'in-review': number;
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
