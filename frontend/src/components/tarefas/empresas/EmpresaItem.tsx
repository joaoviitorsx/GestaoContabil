import { Building2, ChevronRight } from "lucide-react";
import type { Workspace } from "../../../types/workspace/workspace";

interface EmpresaListItemProps {
  empresa: Workspace;
  onClick: () => void;
}

export default function EmpresaListItem({ empresa, onClick }: EmpresaListItemProps) {
  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-blue-300 
      transition-all duration-200 cursor-pointer">
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${empresa.color}15` }}>
          <Building2
            className="w-6 h-6"
            style={{ color: empresa.color }}
            strokeWidth={2}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
            {empresa.nomeFantasia}
          </h3>
          <p className="text-sm text-gray-500 truncate">
            {empresa.razaoSocial}
          </p>
          <p className="text-xs text-gray-400 mt-1">{empresa.cnpj}</p>
        </div>

        <div className="hidden md:flex items-center gap-6 text-center">
          <div>
            <p className="text-lg font-bold text-gray-800">{empresa.totalTasks}</p>
            <p className="text-xs text-gray-500">Tarefas</p>
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
      </div>
    </div>
  );
}
