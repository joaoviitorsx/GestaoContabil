import type { GrupoSetor } from "../../../types/tarefas/grupo";

interface SetorBadgeProps {
  setor: GrupoSetor;
  size?: "sm" | "md" | "lg";
}

const setorConfig: Record<GrupoSetor, string> = {
  Fiscal: "bg-blue-100 text-blue-700 border-blue-200",
  Contábil: "bg-green-100 text-green-700 border-green-200",
  DP: "bg-purple-100 text-purple-700 border-purple-200",
  Financeiro: "bg-orange-100 text-orange-700 border-orange-200",
  Administrativo: "bg-gray-100 text-gray-700 border-gray-200",
};

const sizeConfig = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-2.5 py-1",
  lg: "text-base px-3 py-1.5",
};

export default function SetorBadge({ setor, size = "md" }: SetorBadgeProps) {
  const colorClass = setorConfig[setor];
  const sizeClass = sizeConfig[size];

  return (
    <span className={`inline-flex items-center rounded-full font-medium border ${colorClass} ${sizeClass}`}>
      {setor}
    </span>
  );
}
