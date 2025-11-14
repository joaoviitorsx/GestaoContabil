import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Building2, Info } from "lucide-react";
import MainLayout from "../../layouts/MainLayout";
import { workspacesMock } from "../../mock/workspaces";
import { gruposMock } from "../../mock/grupos";
import { useTasks } from "../../hooks/tarefas/useTasks";
import { useTaskFilters } from "../../hooks/tarefas/useTaskFilters";
import KanbanBoard from "../../components/tarefas/kanban/KanbanBoard";
import type { Workspace } from "../../types/workspace/workspace";
import type { Task, TaskStatus } from "../../types/workspace/task";
import TaskViewModal from "../../components/tarefas/modals/TaskViewModal";
import TaskCreateModal from "../../components/tarefas/modals/TaskCreateModal";
import WorkspaceInfoModal from "../../components/tarefas/modals/WorkspaceInfoModal";

export default function KanbanPage() {
  const { grupoId, empresaId, id } = useParams<{ grupoId?: string; empresaId?: string; id?: string;}>();
  const navigate = useNavigate();
  const workspaceId = empresaId || id;
  const workspace = workspacesMock.find((w: Workspace) => w.id === workspaceId);
  const grupo = gruposMock.find((g) => g.id === workspace?.grupoId);
  
  const { tasks, draggedOverColumn, getTasksByStatus, handleDragStart, handleDragEnd, handleDragOver, handleDragLeave, handleDrop, uniqueValues } = useTasks(workspace?.tasks || []);
  const { filters, updateSearchTerm, updateResponsible, updateSetor, updateFilial, clearFilters, hasActiveFilters } = useTaskFilters();

  // Lista de analistas disponíveis
  const analistasDisponiveis = ["Ana Silva", "João Santos", "Maria Oliveira", "Pedro Costa", "Carla Souza"];

  // Estados dos modais
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createModalStatus, setCreateModalStatus] = useState<TaskStatus>("backlog");
  const [showWorkspaceInfo, setShowWorkspaceInfo] = useState(false);

  const handleBack = () => {
    if (grupoId) {
      navigate(`/tarefas/empresas/${grupoId}`);
    } else {
      navigate("/tarefas");
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleCreateTask = (status: TaskStatus) => {
    setCreateModalStatus(status);
    setShowCreateModal(true);
  };

  const handleCreateTaskSubmit = (taskData: Partial<Task>) => {
    console.log("Nova tarefa criada:", taskData);
    // Aqui você integraria com seu sistema de gerenciamento de estado
    setShowCreateModal(false);
  };

  if (!workspace) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-800 mb-2">
              Empresa não encontrada
            </p>
            <button onClick={handleBack} className="text-blue-600 hover:text-blue-700 font-medium">
              Voltar
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="h-[calc(100vh-8rem)] flex flex-col">
        <div className="mb-6">
          <button onClick={handleBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-4 cursor-pointer group">
            <ArrowLeft className="w-6 h-6 group-hover:text-gray-800 transition-colors" />
            <span className="text-lg font-medium group-hover:underline">
              {grupoId ? "Voltar para Empresas" : "Voltar para Grupos"}
            </span>
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${workspace.color}15` }}>
              <Building2 className="w-7 h-7" style={{ color: workspace.color }}strokeWidth={2}/>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800">
                {workspace.nomeFantasia}
              </h1>
              <p className="text-sm text-gray-500">{workspace.razaoSocial}</p>
            </div>
            <button onClick={() => setShowWorkspaceInfo(true)} className="p-3 hover:bg-gray-300 rounded-lg transition-colors group cursor-pointer" title="Informações da Empresa">
              <Info className="w-8 h-8 text-blue-600 group-hover:text-blue-700" />
            </button>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm p-6 overflow-hidden">
          <KanbanBoard
            tasks={tasks}
            filters={filters}
            onFilterChange={{
              updateSearchTerm,
              updateResponsible,
              updateSetor,
              updateFilial,
              clearFilters,
            }}
            uniqueValues={uniqueValues}
            getTasksByStatus={getTasksByStatus}
            onTaskClick={handleTaskClick}
            onCreateTask={handleCreateTask}
            dragHandlers={{
              handleDragStart,
              handleDragEnd,
              handleDragOver,
              handleDragLeave,
              handleDrop,
            }}
            draggedOverColumn={draggedOverColumn}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        {selectedTask && (
          <TaskViewModal
            task={selectedTask}
            grupoNome={grupo?.nome || "Grupo Desconhecido"}
            onClose={() => setSelectedTask(null)}
            canEdit={true}
          />
        )}

        {showCreateModal && workspace && (
          <TaskCreateModal
            initialStatus={createModalStatus}
            workspace={workspace}
            grupoNome={grupo?.nome || "Grupo Desconhecido"}
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreateTaskSubmit}
            analistas={analistasDisponiveis}
          />
        )}

        {showWorkspaceInfo && workspace && (
          <WorkspaceInfoModal
            workspace={workspace}
            onClose={() => setShowWorkspaceInfo(false)}
          />
        )}
      </div>
    </MainLayout>
  );
}