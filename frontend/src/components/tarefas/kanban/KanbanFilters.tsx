import { Filter, X } from "lucide-react";
import SearchBar from "../shared/SearchBar";
import Select from "../../inputSelect";

interface KanbanFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedResponsible: string;
  onResponsibleChange: (value: string) => void;
  selectedSetor: string;
  onSetorChange: (value: string) => void;
  responsibles: string[];
  setores: string[];
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export default function KanbanFilters({ searchTerm, onSearchChange, selectedResponsible, onResponsibleChange, selectedSetor, onSetorChange, responsibles,
  setores, hasActiveFilters, onClearFilters}: KanbanFiltersProps) {
  return (
    <div className="space-y-4">
      <SearchBar value={searchTerm} onChange={onSearchChange} placeholder="Buscar tarefas por título ou descrição..." className="max-w-xl" />

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-gray-600">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Filtrar por:</span>
        </div>

        <Select
          value={selectedResponsible}
          onChange={(value) => onResponsibleChange(value)}
          className="w-64"
          options={[
            { value: "", label: "Todos os Responsáveis" },
            ...responsibles.map((responsible) => ({
              value: responsible,
              label: responsible,
            })),
          ]}
        />

        <Select
          value={selectedSetor}
          onChange={(value) => onSetorChange(value)}
          className="w-50"
          options={[
            { value: "Fiscal, Contábil, DP", label: "Todos os Setores" },
            ...setores.map((setor) => ({
              value: setor,
              label: setor,
            })),
          ]}
          placeholder="Todos os Setores"
          customSize="md"
        />

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 
            rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 cursor-pointer">
            <X className="w-4 h-4" />
            Limpar Filtros
          </button>
        )}
      </div>
    </div>
  );
}
