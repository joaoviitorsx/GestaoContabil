import { Plus, type LucideIcon } from "lucide-react";
import type { Task, TaskStatus } from "../../../types/workspace/task";
import KanbanCard from "./KanbanCard";

interface KanbanColumnProps {
  status: TaskStatus;
  title: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  tasks: Task[];
  onDragOver: (e: React.DragEvent, status: TaskStatus) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, status: TaskStatus) => void;
  onTaskClick: (task: Task) => void;
  onCreateTask: (status: TaskStatus) => void;
  onDragStart: (task: Task) => void;
  onDragEnd: () => void;
  isDraggedOver: boolean;
}

export default function KanbanColumn({ status, title, icon: Icon, color, bgColor, borderColor, tasks, onDragOver, onDragLeave, onDrop, onTaskClick, onCreateTask, onDragStart, onDragEnd, isDraggedOver}: KanbanColumnProps) {
  return (
    <div className="flex flex-col h-full min-w-[320px]">
      <div className={`flex items-center justify-between p-4 rounded-t-xl border-1 ${borderColor} ${bgColor}`}>
        <div className="flex items-center gap-2">
          <Icon className={`w-8 h-5 ${color}`} />
          <h3 className={`font-bold ${color}`}>{title}</h3>
          <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${color} bg-white`}>
            {tasks.length}
          </span>
        </div>
        <button onClick={() => onCreateTask(status)} className={`p-1.5 bg-gray-100 hover:bg-gray-300 rounded-lg transition-colors cursor-pointer ${color}`} title="Adicionar tarefa">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div
        onDragOver={(e) => onDragOver(e, status)}
        onDragLeave={onDragLeave}
        onDrop={(e) => onDrop(e, status)}
        className={`flex-1 p-3 space-y-3 border-1 border-t-0 rounded-b-xl overflow-y-auto transition-all duration-200 ${
          isDraggedOver
            ? `${borderColor} ${bgColor}`
            : "border-gray-200 bg-gray-50"
        }`}
        style={{ maxHeight: "calc(100vh - 350px)", minHeight: "400px" }}>
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-400">
            <Icon className="w-8 h-8 mb-2" />
            <p className="text-sm">Nenhuma tarefa</p>
          </div>
        ) : (
          tasks.map((task) => (
            <KanbanCard
              key={task.id}
              task={task}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onClick={onTaskClick}
            />
          ))
        )}
      </div>
    </div>
  );
}
