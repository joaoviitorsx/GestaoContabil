import { Building2, MapPin, Phone, Mail, User, Plus, CheckCircle, XCircle } from "lucide-react";
import type { Workspace } from "../../types/workspace";

interface WorkspaceBranchesProps {
  workspace: Workspace;
}

function WorkspaceBranches({ workspace }: WorkspaceBranchesProps) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Filiais</h2>
          <p className="text-gray-500">Gerencie as filiais da empresa</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Nova Filial
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {workspace.filiais.map((filial) => (
          <div key={filial.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{filial.name}</h3>
                  <p className="text-sm text-gray-500">{filial.cnpj}</p>
                </div>
              </div>

              {filial.active ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
                  <CheckCircle className="w-3 h-3" />
                  Ativa
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-semibold">
                  <XCircle className="w-3 h-3" />
                  Inativa
                </span>
              )}
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-medium">Endereço</p>
                  <p className="text-sm text-gray-800">{filial.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-gray-400 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-medium">Telefone</p>
                  <a href={`tel:${filial.phone}`} className="text-sm text-blue-600 hover:underline">
                    {filial.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-gray-400 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-medium">E-mail</p>
                  <a href={`mailto:${filial.email}`} className="text-sm text-blue-600 hover:underline">
                    {filial.email}
                  </a>
                </div>
              </div>

              {filial.manager && (
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 font-medium">Responsável</p>
                    <p className="text-sm text-gray-800 font-semibold">{filial.manager}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-100">
              <button className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Editar
              </button>
              <button className="flex-1 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                Ver Detalhes
              </button>
            </div>
          </div>
        ))}
      </div>

      {workspace.filiais.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhuma filial cadastrada</h3>
          <p className="text-gray-500 mb-6">Adicione a primeira filial para começar</p>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Adicionar Filial
          </button>
        </div>
      )}
    </div>
  );
}

export default WorkspaceBranches;
