import { FolderOpen } from "lucide-react";
import type { Grupo } from "../../../types/tarefas/grupo";
import GrupoCard from "./GrupoCard";

interface GruposListProps {
  grupos: Grupo[];
  onSelectGrupo: (grupoId: string) => void;
  emptyMessage?: string;
}

export default function GruposList({ grupos, onSelectGrupo, emptyMessage = "Nenhum grupo encontrado",}: GruposListProps) {
  if (grupos.length === 0) {
    return (
      <div className="text-center py-12">
        <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-xl font-semibold text-gray-600 mb-2">
          Nenhum grupo cadastrado
        </p>
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {grupos.map((grupo) => (
        <GrupoCard
          key={grupo.id}
          grupo={grupo}
          onClick={() => onSelectGrupo(grupo.id)}
        />
      ))}
    </div>
  );
}
