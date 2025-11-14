import { useState, useMemo, useCallback } from "react";
import type { Task, TaskStatus } from "../../types/workspace/task";
import type { TaskFilters } from "../../types/tarefas/filters";

export function useTasks(initialTasks: Task[]) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [draggedOverColumn, setDraggedOverColumn] = useState<TaskStatus | null>(null);

  const filterTasks = useCallback((tasks: Task[], filters: TaskFilters) => {
    return tasks.filter((task) => {
      const matchesSearch =
        !filters.searchTerm ||
        task.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(filters.searchTerm.toLowerCase());

      const matchesResponsible =
        !filters.responsible || task.responsible.name === filters.responsible;

      const matchesSetor = !filters.setor || task.setor === filters.setor;

      const matchesStatus = !filters.status || task.status === filters.status;

      const matchesFilial = !filters.filial || task.filial === filters.filial;

      return (
        matchesSearch &&
        matchesResponsible &&
        matchesSetor &&
        matchesStatus &&
        matchesFilial
      );
    });
  }, []);

  const getTasksByStatus = useCallback(
    (status: TaskStatus, filters?: TaskFilters) => {
      const filteredTasks = filters ? filterTasks(tasks, filters) : tasks;
      return filteredTasks.filter((task) => task.status === status);
    },
    [tasks, filterTasks]
  );

  const addTask = useCallback((task: Task) => {
    setTasks((prev) => [...prev, task]);
  }, []);

  const updateTask = useCallback((updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  }, []);

  const moveTask = useCallback((taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  }, []);

  // Drag and Drop handlers
  const handleDragStart = useCallback((task: Task) => {
    setDraggedTask(task);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedTask(null);
    setDraggedOverColumn(null);
  }, []);

  const handleDragOver = useCallback((status: TaskStatus) => {
    setDraggedOverColumn(status);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDraggedOverColumn(null);
  }, []);

  const handleDrop = useCallback(
    (newStatus: TaskStatus) => {
      if (!draggedTask || draggedTask.status === newStatus) {
        setDraggedTask(null);
        setDraggedOverColumn(null);
        return;
      }

      moveTask(draggedTask.id, newStatus);
      setDraggedTask(null);
      setDraggedOverColumn(null);
    },
    [draggedTask, moveTask]
  );

  const uniqueValues = useMemo(() => {
    return {
      responsibles: Array.from(new Set(tasks.map((t) => t.responsible.name))),
      setores: Array.from(new Set(tasks.map((t) => t.setor))),
      filiais: Array.from(new Set(tasks.map((t) => t.filial))),
    };
  }, [tasks]);

  return {
    tasks,
    draggedTask,
    draggedOverColumn,
    filterTasks,
    getTasksByStatus,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    uniqueValues,
  };
}
