import { useState, useMemo } from "react";
import {Search, Calendar, Paperclip, MessageSquare, Link2, AlertCircle, Clock, Play, CheckCircle2, Plus, User, GripVertical} from "lucide-react";
import type { Workspace, Task, TaskStatus } from "../../types/workspace";
import TaskCreateModal, { type TaskFormData } from "./TaskCreateModal";
import TaskViewModal from "./TaskViewModal";

interface WorkspaceKanbanProps {
  workspace: Workspace;
}

function WorkspaceKanban({ workspace }: WorkspaceKanbanProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterResponsible, setFilterResponsible] = useState<string>("");
  const [filterSetor, setFilterSetor] = useState<string>("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>(workspace.tasks);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [draggedOverColumn, setDraggedOverColumn] = useState<TaskStatus | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createModalStatus, setCreateModalStatus] = useState<TaskStatus>("backlog");

  // Get unique values for filters
  const uniqueResponsibles = useMemo(() => {
    const names = tasks.map((t) => t.responsible.name);
    return Array.from(new Set(names));
  }, [tasks]);

  const uniqueSetores = useMemo(() => {
    const setores = tasks.map((t) => t.setor);
    return Array.from(new Set(setores));
  }, [tasks]);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        !searchTerm ||
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesResponsible =
        !filterResponsible || task.responsible.name === filterResponsible;

      const matchesSetor = !filterSetor || task.setor === filterSetor;

      return matchesSearch && matchesResponsible && matchesSetor;
    });
  }, [tasks, searchTerm, filterResponsible, filterSetor]);

  const getTasksByStatus = (status: TaskStatus) => {
    return filteredTasks.filter((task) => task.status === status);
  };

  // Drag and Drop handlers
  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDraggedOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    setDraggedOverColumn(status);
  };

  const handleDragLeave = () => {
    setDraggedOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    
    if (!draggedTask || draggedTask.status === newStatus) {
      setDraggedTask(null);
      setDraggedOverColumn(null);
      return;
    }

    // Update task status
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === draggedTask.id ? { ...task, status: newStatus } : task
      )
    );

    setDraggedTask(null);
    setDraggedOverColumn(null);
  };

  const handleCreateTask = (taskData: TaskFormData) => {
    const newTask: Task = {
      id: `t${Date.now()}`,
      title: taskData.title,
      description: taskData.description,
      status: taskData.status,
      setor: taskData.setor,
      filial: taskData.filial,
      responsible: taskData.responsible,
      dueDate: taskData.dueDate,
      isLate: false,
      attachments: taskData.attachmentIds.length,
      comments: 0,
      links: taskData.accessLinkIds.length,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      accessLinkIds: taskData.accessLinkIds,
      attachmentIds: taskData.attachmentIds,
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
    setShowCreateModal(false);
  };

  const handleOpenCreateModal = (status: TaskStatus) => {
    setCreateModalStatus(status);
    setShowCreateModal(true);
  };

  // Função para atualizar tarefa
  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  const columns = [
    {
      status: "backlog" as TaskStatus,
      title: "A Fazer",
      icon: Clock,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-400",
      dotColor: "bg-gray-500",
      tasks: getTasksByStatus("backlog"),
    },
    {
      status: "in-progress" as TaskStatus,
      title: "Em Andamento",
      icon: Play,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-700",
      dotColor: "bg-blue-500",
      tasks: getTasksByStatus("in-progress"),
    },
    {
      status: "in-review" as TaskStatus,
      title: "Em Revisão",
      icon: AlertCircle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-700",
      dotColor: "bg-yellow-500",
      tasks: getTasksByStatus("in-review"),
    },
    {
      status: "done" as TaskStatus,
      title: "Concluído",
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-700",
      dotColor: "bg-green-500",
      tasks: getTasksByStatus("done"),
    },
  ];

  const getSetorColor = (setor: string) => {
    const colors: Record<string, string> = {
      Fiscal: "bg-blue-100 text-blue-700 border-blue-200",
      Contábil: "bg-green-100 text-green-700 border-green-200",
      DP: "bg-purple-100 text-purple-700 border-purple-200",
      Financeiro: "bg-orange-100 text-orange-700 border-orange-200",
      Administrativo: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return colors[setor] || colors.Administrativo;
  };

  const isTaskLate = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 pb-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800">Quadro de Tarefas</h2>
            <p className="text-gray-500 text-sm">
              Gerencie e acompanhe todas as tarefas • Total: {tasks.length} tarefas
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por título ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <select
            value={filterResponsible}
            onChange={(e) => setFilterResponsible(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          >
            <option value="">Todos os responsáveis</option>
            {uniqueResponsibles.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          <select
            value={filterSetor}
            onChange={(e) => setFilterSetor(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          >
            <option value="">Todos os setores</option>
            {uniqueSetores.map((setor) => (
              <option key={setor} value={setor}>
                {setor}
              </option>
            ))}
          </select>

          {(searchTerm || filterResponsible || filterSetor) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterResponsible("");
                setFilterSetor("");
              }}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-x-auto px-6 pb-6">
        <div className="flex gap-4 h-full min-w-max">
          {columns.map((column) => {
            const Icon = column.icon;
            return (
              <div key={column.status} className="flex-1 min-w-[340px] max-w-[380px] flex flex-col">
                <div className={`${column.bgColor} rounded-t-xl p-4 border-b-2 ${column.borderColor}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${column.dotColor}`} />
                    <Icon className={`w-5 h-5 ${column.color}`} />
                    <h3 className="font-bold text-gray-800">{column.title}</h3>
                    <span className={`ml-auto px-2.5 py-1 ${column.bgColor} ${column.color} rounded-full text-xs font-bold`}>
                      {column.tasks.length}
                    </span>
                  </div>
                  
                  <button onClick={() => handleOpenCreateModal(column.status)}
                    className={`w-full flex items-center justify-center gap-2 px-3 py-2 ${column.color} ${column.bgColor} hover:opacity-80 rounded-lg transition-all text-sm font-medium border border-dashed cursor-pointer ${column.borderColor}`}>
                    <Plus className="w-4 h-4" />
                    Adicionar tarefa
                  </button>
                </div>

                <div className={`flex-1 bg-gray-50 rounded-b-xl p-4 overflow-y-auto space-y-3 transition-all`}
                  onDragOver={(e) => handleDragOver(e, column.status)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, column.status)}>

                  {column.tasks.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={() => handleDragStart(task)}
                      onDragEnd={handleDragEnd}
                      onClick={() => setSelectedTask(task)}
                      className={`bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 cursor-move group relative ${
                        draggedTask?.id === task.id ? "opacity-50 scale-95" : ""
                      }`}>
                      <div className="absolute left-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical className="w-4 h-4 text-gray-400" />
                      </div>

                      <h4 className="font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors pl-2">
                        {task.title}
                      </h4>

                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {task.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${getSetorColor(
                            task.setor
                          )}`}
                        >
                          {task.setor}
                        </span>
                      </div>

                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br bg-gray-400 flex items-center justify-center text-white text-xs font-bold">
                            <User className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-800">{task.responsible.name}</p>
                        </div>
                    </div>

                      <div
                        className={`flex items-center gap-2 text-xs mb-3 px-2 py-1.5 rounded-lg ${
                          task.isLate || isTaskLate(task.dueDate)
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-gray-50 text-gray-700"
                        }`}>
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="font-medium">
                          {new Date(task.dueDate).toLocaleDateString("pt-BR")}
                        </span>
                        {(task.isLate || isTaskLate(task.dueDate)) && (
                          <span className="ml-auto font-bold">Atrasado</span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-gray-500 text-xs">
                        {(task.attachments ?? 0) > 0 && (
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md">
                            <Paperclip className="w-3.5 h-3.5" />
                            <span className="font-medium">{task.attachments}</span>
                          </div>
                        )}
                        {(task.comments ?? 0) > 0 && (
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md">
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span className="font-medium">{task.comments}</span>
                          </div>
                        )}
                        {(task.links ?? 0) > 0 && (
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md">
                            <Link2 className="w-3.5 h-3.5" />
                            <span className="font-medium">{task.links}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {column.tasks.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                      <Icon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm font-medium">
                        {draggedOverColumn === column.status
                          ? "Solte a tarefa aqui"
                          : "Nenhuma tarefa"}
                      </p>
                      <p className="text-xs">
                        {draggedOverColumn === column.status
                          ? "↓ Mova para esta coluna"
                          : "As tarefas aparecerão aqui"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedTask && (
        <TaskViewModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          workspace={workspace}
          isAdmin={true}
          onUpdateTask={handleUpdateTask}
        />
      )}

      {showCreateModal && (
        <TaskCreateModal
          workspace={workspace}
          onClose={() => setShowCreateModal(false)}
          initialStatus={createModalStatus}
          onSave={handleCreateTask}
        />
      )}
    </div>
  );
}

export default WorkspaceKanban;