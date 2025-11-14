import { Calendar,  User, GripVertical, Paperclip, Link } from "lucide-react";
import type { Task } from "../../../types/workspace/task";
import SetorBadge from "../shared/SetorBadge";
import type { GrupoSetor } from "../../../types/tarefas/grupo";

interface KanbanCardProps {
  task: Task;
  onDragStart: (task: Task) => void;
  onDragEnd: () => void;
  onClick: (task: Task) => void;
}

export default function KanbanCard({ task, onDragStart, onDragEnd, onClick}: KanbanCardProps) {
    const isLate = new Date(task.dueDate) < new Date() && task.status !== "done";
    const isComing = new Date(task.dueDate) > new Date() && new Date(task.dueDate) <= new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) && task.status !== "done";

    return (
        <div draggable onDragStart={() => onDragStart(task)} onDragEnd={onDragEnd} onClick={() => onClick(task)}
        className="group bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:border-blue-300">
        <div className="flex items-start gap-2 mb-3">
            <GripVertical className="w-4 h-4 text-gray-400 cursor-grab active:cursor-grabbing flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {task.title}
            </h4>
            {task.description && (
                <p className="text-xs text-gray-500 line-clamp-2">
                {task.description}
                </p>
            )}
            </div>
        </div>

        <div className="mb-3">
            <SetorBadge setor={task.setor as GrupoSetor} size="sm" />
        </div>

        <div className="space-y-2 mb-3">
            <div className="flex items-center gap-2 text-xs">
            <Calendar className="w-3.5 h-3.5" />
            <span className={`font-medium ${ isLate ? "text-red-600" : "text-gray-600" }`}>
                {new Date(task.dueDate).toLocaleDateString("pt-BR")}
            </span>
            {isComing && (
                <span className="ml-auto px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-[10px] font-bold">
                PRÓXIMA AO PRAZO
                </span>
            )}
            {isLate && (
                <span className="ml-auto px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-[10px] font-bold">
                ATRASADA
                </span>
            )}
            </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-700 truncate">
                {task.responsible.name}
            </p>
            </div>
        </div>

        {(task.attachmentIds.length > 0 || task.accessLinkIds.length > 0) && (
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
            {task.attachmentIds.length > 0 && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                <Paperclip className="w-3.5 h-3.5" /> {task.attachmentIds.length}
                </span>
            )}
            {task.accessLinkIds.length > 0 && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                <Link className="w-3.5 h-3.5" /> {task.accessLinkIds.length}
                </span>
            )}
            </div>
        )}
        </div>
    );
}
