import { Building2} from "lucide-react";
import type { Workspace } from "../../types/workspace";

interface WorkspaceInfoProps {
  workspace: Workspace;
}

function WorkspaceInfo({ workspace }: WorkspaceInfoProps) {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Informações da Empresa</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Dados Cadastrais</h3>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500 font-medium">Nome Fantasia</p>
              <p className="text-base font-semibold text-gray-800">{workspace.nomeFantasia}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Razão Social</p>
              <p className="text-base font-semibold text-gray-800">{workspace.razaoSocial}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">CNPJ</p>
              <p className="text-base font-semibold text-gray-800">{workspace.cnpj}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Setor Principal</p>
              <p className="text-base font-semibold text-gray-800">{workspace.setor}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkspaceInfo;
