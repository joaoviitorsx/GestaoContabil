interface KanbanHeaderProps {
  title: string;
  subtitle: string;
  totalTasks: number;
}


export default function KanbanHeader({ title, subtitle, totalTasks,}: KanbanHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                <p className="text-gray-500 text-sm">
                {subtitle} • Total: {totalTasks} tarefas
                </p>
            </div>
        </div>
  );
}
