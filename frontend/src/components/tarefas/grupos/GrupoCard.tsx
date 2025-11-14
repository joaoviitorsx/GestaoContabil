import { Folder } from "lucide-react";
import type { Grupo } from "../../../types/tarefas/grupo";

interface GrupoCardProps {
  grupo: Grupo;
  onClick: () => void;
}

export default function GrupoCard({ grupo, onClick }: GrupoCardProps) {
  return (
    <div onClick={onClick}  className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-gray-300 
        transition-all duration-300 cursor-pointer p-6">
      <div  className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" 
        style={{ backgroundColor: `${grupo.cor}15` }}>
        <Folder className="w-8 h-8"  style={{ color: grupo.cor }}  strokeWidth={2}/>
      </div>

      <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
        {grupo.nome}
      </h3>

      {grupo.descricao && (
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {grupo.descricao}
        </p>
      )}

    </div>
  );
}
