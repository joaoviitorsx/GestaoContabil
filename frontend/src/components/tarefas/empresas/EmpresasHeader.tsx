import { ArrowLeft, Search, X } from "lucide-react";
import type { Grupo } from "../../../types/tarefas/grupo";

interface EmpresasHeaderProps {
  grupo: Grupo;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onBack: () => void;
  totalEmpresas: number;
}

export default function EmpresasHeader({ grupo, searchTerm, onSearchChange, onBack,totalEmpresas,}: EmpresasHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-gray-300 hover:bg-gray-400 rounded-lg transition-colors cursor-pointer" aria-label="Voltar">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{grupo.nome}</h1>
              {grupo.descricao && (
                <p className="text-sm text-gray-500">{grupo.descricao}</p>
              )}
            </div>
          </div>
        </div>

        <div className="hidden sm:block text-right">
          <p className="text-2xl font-bold text-gray-800">{totalEmpresas}</p>
          <p className="text-sm text-gray-500">
            {totalEmpresas === 1 ? "Empresa" : "Empresas"}
          </p>
        </div>
      </div>

    <div className="relative w-160">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        placeholder="Buscar por Razão social ou CNPJ..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg 
        focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"/>
      {searchTerm && (
        <button 
        onClick={() => onSearchChange("")} 
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer"
        aria-label="Limpar busca"
        title="Limpar busca">
        <X className="w-4 h-4 text-gray-600 hover:text-red-300 transition-colors" />
        </button>
      )}
    </div>
    </div>
  );
}
