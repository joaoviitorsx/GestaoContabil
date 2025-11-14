import { Building2, MapPin, FileText, CheckCircle2 } from "lucide-react";
import type { CardFornecedorProps } from "../types/components/cardFornecedor";

function cardFornecedor({fornecedor}:CardFornecedorProps){
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Building2 className="text-blue-600" size={20} />
            {fornecedor.razaoSocial}
          </h2>
          <p className="text-gray-500 text-sm mt-1">{fornecedor.cnpj}</p>
        </div>
        <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${
            fornecedor.situacao === "ATIVA" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          <CheckCircle2 size={14} />
          {fornecedor.situacao}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-700">
        <div className="flex flex-col">
          <span className="font-medium text-gray-500">CNAE Principal</span>
          <span>{fornecedor.cnae}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-gray-500">Regime Tributário</span>
          <span>{fornecedor.regime}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-gray-500">Localização</span>
          <span className="flex items-center gap-1">
            <MapPin size={14} className="text-gray-400" />
            {fornecedor.municipio} - {fornecedor.uf}
          </span>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <p className="text-gray-500 text-sm flex items-center gap-2">
          <FileText size={16} className="text-gray-400" />
          Dados obtidos via API pública de consulta fiscal
        </p>
      </div>
    </div>
  );
}

export default cardFornecedor;