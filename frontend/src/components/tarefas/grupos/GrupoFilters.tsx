import { X } from "lucide-react";
import SearchBar from "../shared/SearchBar";

interface GrupoFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export default function GrupoFilters({
  searchTerm,
  onSearchChange,
  hasActiveFilters,
  onClearFilters,
}: GrupoFiltersProps) {
  return (
    <div className="flex items-center gap-3">
      <SearchBar
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Buscar grupos por nome..."
        className="flex-1 max-w-md"
      />

      {hasActiveFilters && (
        <button onClick={onClearFilters} className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <X className="w-4 h-4" />
          Limpar
        </button>
      )}
    </div>
  );
}
