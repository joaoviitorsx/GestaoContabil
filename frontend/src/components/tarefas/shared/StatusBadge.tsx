import type { TaskStatus } from "../../../types/workspace/task";

interface StatusBadgeProps {
  status: TaskStatus;
  size?: "sm" | "md" | "lg";
}

const statusConfig: Record<TaskStatus, { label: string; color: string; dotColor: string }> = {
  backlog: {
    label: "A Fazer",
    color: "bg-gray-100 text-gray-700 border-gray-200",
    dotColor: "bg-gray-500",
  },
  "in-progress": {
    label: "Em Andamento",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    dotColor: "bg-blue-500",
  },
  "in-review": {
    label: "Em Revisão",
    color: "bg-yellow-100 text-yellow-700 border-yellow-300",
    dotColor: "bg-yellow-500",
  },
  done: {
    label: "Concluído",
    color: "bg-green-100 text-green-700 border-green-300",
    dotColor: "bg-green-500",
  },
};

const sizeConfig = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-2.5 py-1",
  lg: "text-base px-3 py-1.5",
};

export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = statusConfig[status];
  const sizeClass = sizeConfig[size];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${config.color} ${sizeClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      {config.label}
    </span>
  );
}
