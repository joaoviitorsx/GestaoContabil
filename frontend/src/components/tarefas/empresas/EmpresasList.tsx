import { Building2 } from "lucide-react";
import type { Workspace } from "../../../types/workspace/workspace";
import EmpresaListItem from "./EmpresaItem";

interface EmpresasListProps {
  empresas: Workspace[];
  onSelectEmpresa: (empresaId: string) => void;
  emptyMessage?: string;
}

export default function EmpresasList({ empresas, onSelectEmpresa, emptyMessage = "Nenhuma empresa encontrada"}: EmpresasListProps) {
  if (empresas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Building2 className="w-20 h-20 text-gray-300 mb-4" />
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {empresas.map((empresa) => (
        <EmpresaListItem
          key={empresa.id}
          empresa={empresa}
          onClick={() => onSelectEmpresa(empresa.id)}
        />
      ))}
    </div>
  );
}
