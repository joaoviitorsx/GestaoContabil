import { Building2, ArrowRight } from "lucide-react";
import type { WorkspaceCardProps } from "../../types/workspace";

function WorkspaceCard({ workspace, onClick, getSetorColor }: WorkspaceCardProps) {
  return (
    <div onClick={onClick}
      className="group relative bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer">
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, ${workspace.color}, ${workspace.color}dd)`}}/>

      <div className="p-6 pt-7">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
            style={{ backgroundColor: `${workspace.color}15` }}>
            <Building2 className="w-6 h-6" style={{ color: workspace.color }} strokeWidth={2} />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-gray-900 truncate mb-0.5 group-hover:text-blue-600 transition-colors">
              {workspace.nomeFantasia}
            </h3>
            <p className="text-xs text-gray-500 truncate mb-2">
              {workspace.razaoSocial}
            </p>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${getSetorColor(workspace.setor)}`}>
              {workspace.setor}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-[11px] text-gray-500 font-medium uppercase tracking-wide">
                Filiais
              </span>
            </div>
            <p className="text-lg font-bold text-gray-900">{workspace.filiais.length}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3.5 h-3.5 rounded-sm bg-blue-500" />
              <span className="text-[11px] text-gray-500 font-medium uppercase tracking-wide">
                Tarefas
              </span>
            </div>
            <p className="text-lg font-bold text-gray-900">{workspace.totalTasks}</p>
          </div>
        </div>

        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group/btn">
          <span className="text-sm font-medium">Acessar empresa</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
        </button>
      </div>
    </div>
  );
}

export default WorkspaceCard;