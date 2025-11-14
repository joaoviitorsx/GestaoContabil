export type TaskStatus = "backlog" | "in-progress" | "in-review" | "done";

export interface TaskResponsible {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  setor: string;
  filial: string;
  responsible: TaskResponsible;
  dueDate: string;

  accessLinkIds: string[];
  attachmentIds: string[];

  createdAt: string;
  updatedAt: string;
}
