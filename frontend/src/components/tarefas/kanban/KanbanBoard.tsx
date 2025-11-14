import { Clock, Play, AlertCircle, CheckCircle2} from "lucide-react";
import type { Task, TaskStatus } from "../../../types/workspace/task";
import type { TaskFilters } from "../../../types/tarefas/filters";
import KanbanColumn from "./KanbanColumn";
import KanbanFilters from "./KanbanFilters";
import KanbanHeader from "./KanbanHeader";

interface KanbanBoardProps {
  tasks: Task[];
  filters: TaskFilters;
  onFilterChange: {
    updateSearchTerm: (value: string) => void;
    updateResponsible: (value: string) => void;
    updateSetor: (value: string) => void;
    updateFilial: (value: string) => void;
    clearFilters: () => void;
  };
  uniqueValues: {
    responsibles: string[];
    setores: string[];
    filiais: string[];
  };
  getTasksByStatus: (status: TaskStatus, filters?: TaskFilters) => Task[];
  onTaskClick: (task: Task) => void;
  onCreateTask: (status: TaskStatus) => void;
  dragHandlers: {
    handleDragStart: (task: Task) => void;
    handleDragEnd: () => void;
    handleDragOver: (status: TaskStatus) => void;
    handleDragLeave: () => void;
    handleDrop: (status: TaskStatus) => void;
  };
  draggedOverColumn: TaskStatus | null;
  hasActiveFilters: () => boolean;
}

const columns = [
  {
    status: "backlog" as TaskStatus,
    title: "A Fazer",
    icon: Clock,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-400",
  },
  {
    status: "in-progress" as TaskStatus,
    title: "Em Andamento",
    icon: Play,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-700",
  },
  {
    status: "in-review" as TaskStatus,
    title: "Em Revisão",
    icon: AlertCircle,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-700",
  },
  {
    status: "done" as TaskStatus,
    title: "Concluído",
    icon: CheckCircle2,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-700",
  },
];

export default function KanbanBoard({ tasks, filters, onFilterChange, uniqueValues, getTasksByStatus, onTaskClick, onCreateTask, dragHandlers, draggedOverColumn, hasActiveFilters,
}: KanbanBoardProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="pb-4">
        <KanbanHeader
          title="Quadro de Tarefas"
          subtitle="Gerencie e acompanhe todas as tarefas"
          totalTasks={tasks.length}
        />

        <KanbanFilters
          searchTerm={filters.searchTerm}
          onSearchChange={onFilterChange.updateSearchTerm}
          selectedResponsible={filters.responsible}
          onResponsibleChange={onFilterChange.updateResponsible}
          selectedSetor={filters.setor}
          onSetorChange={onFilterChange.updateSetor}
          responsibles={uniqueValues.responsibles}
          setores={uniqueValues.setores}
          hasActiveFilters={hasActiveFilters()}
          onClearFilters={onFilterChange.clearFilters}
        />
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-4 h-full pb-4">
          {columns.map((column) => (
            <KanbanColumn
              key={column.status}
              status={column.status}
              title={column.title}
              icon={column.icon}
              color={column.color}
              bgColor={column.bgColor}
              borderColor={column.borderColor}
              tasks={getTasksByStatus(column.status, filters)}
              onDragOver={(e, status) => {
                e.preventDefault();
                dragHandlers.handleDragOver(status);
              }}
              onDragLeave={dragHandlers.handleDragLeave}
              onDrop={(e, status) => {
                e.preventDefault();
                dragHandlers.handleDrop(status);
              }}
              onTaskClick={onTaskClick}
              onCreateTask={onCreateTask}
              onDragStart={dragHandlers.handleDragStart}
              onDragEnd={dragHandlers.handleDragEnd}
              isDraggedOver={draggedOverColumn === column.status}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
