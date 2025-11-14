import { X, Building2, Phone, Mail, Users, CheckCircle2, Calendar, FileCheck, AlertCircle, Shield, Briefcase, UserCheck } from "lucide-react";
import type { Workspace } from "../../../types/workspace/workspace";

interface WorkspaceInfoModalProps {
  workspace: Workspace;
  onClose: () => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

const getSituacaoColor = (situacao: string) => {
  switch (situacao) {
    case 'Ativa':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'Em Rescisão':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'Baixada':
      return 'bg-red-100 text-red-700 border-red-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

export default function WorkspaceInfoModal({ workspace, onClose }: WorkspaceInfoModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-start justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${workspace.color}15` }}>
              <Building2 className="w-8 h-8"
                style={{ color: workspace.color }} strokeWidth={2} />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                {workspace.nomeFantasia}
              </h2>
              <p className="text-gray-600 text-sm mb-2">{workspace.razaoSocial}</p>
              <div className="flex items-center gap-3">
                <p className="text-gray-500 text-xs font-mono">{workspace.cnpj}</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSituacaoColor(workspace.situacao)}`}>
                  {workspace.situacao}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-lg transition-colors cursor-pointer">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Informações Cadastrais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoCard label="Razão Social" value={workspace.razaoSocial} />
              <InfoCard label="Nome Fantasia" value={workspace.nomeFantasia} />
              <InfoCard label="CNPJ" value={workspace.cnpj} />
              {workspace.inscricaoEstadual && (
                <InfoCard label="Inscrição Estadual" value={workspace.inscricaoEstadual} />
              )}
              {workspace.inscricaoMunicipal && (
                <InfoCard label="Inscrição Municipal" value={workspace.inscricaoMunicipal} />
              )}
              {workspace.grupo && (
                <InfoCard label="Grupo" value={workspace.grupo} />
              )}
              <InfoCard label="Regime Tributário" value={workspace.regimeTributario} />
              <InfoCard 
                label="Início do Contrato" 
                value={formatDate(workspace.inicioContrato)}
                icon={<Calendar className="w-4 h-4 text-blue-500" />}
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FileCheck className="w-4 h-4" />
              Situação da Empresa
            </h3>
            
            {workspace.situacao === 'Ativa' && workspace.situacaoAtiva && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-700">Empresa Ativa</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <InfoCard 
                    label="Procuração DET" 
                    value={workspace.situacaoAtiva.procuracaoDET}
                    compact
                  />
                  <InfoCard 
                    label="Apresentação" 
                    value={workspace.situacaoAtiva.apresentacao}
                    compact
                  />
                  <InfoCard 
                    label="Encerramento Inter." 
                    value={workspace.situacaoAtiva.encerramentoInter}
                    compact
                  />
                </div>
              </div>
            )}

            {workspace.situacao === 'Em Rescisão' && workspace.situacaoEmRescisao && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <span className="font-semibold text-yellow-700">Empresa em Rescisão</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <InfoCard 
                    label="Status da Rescisão" 
                    value={workspace.situacaoEmRescisao.statusRescisao}
                    compact
                  />
                  <InfoCard 
                    label="Data de Rescisão" 
                    value={formatDate(workspace.situacaoEmRescisao.dataRescisao)}
                    compact
                  />
                  <InfoCard 
                    label="Contratos" 
                    value={workspace.situacaoEmRescisao.contratos}
                    compact
                  />
                  <InfoCard 
                    label="Procuração" 
                    value={workspace.situacaoEmRescisao.procuracao}
                    compact
                  />
                  <InfoCard 
                    label="DET" 
                    value={workspace.situacaoEmRescisao.det}
                    compact
                  />
                </div>
              </div>
            )}

            {workspace.situacao === 'Baixada' && workspace.situacaoBaixada && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="font-semibold text-red-700">Empresa Baixada</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InfoCard 
                    label="Status Final" 
                    value={workspace.situacaoBaixada.statusFinal}
                    compact
                  />
                  <InfoCard 
                    label="Data da Baixa" 
                    value={formatDate(workspace.situacaoBaixada.dataBaixa)}
                    compact
                  />
                  <InfoCard 
                    label="Contratos de Encerramento" 
                    value={workspace.situacaoBaixada.contratosEncerramento}
                    compact
                  />
                  <InfoCard 
                    label="Procuração" 
                    value={workspace.situacaoBaixada.procuracao}
                    compact
                  />
                  <InfoCard 
                    label="Status DBE" 
                    value={workspace.situacaoBaixada.statusDBE}
                    compact
                  />
                </div>
              </div>
            )}
          </div>

          {/* Atribuição dos Setores */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Atribuição dos Setores
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {workspace.setorContabil && (
                <SetorCard 
                  nome="Contábil" 
                  info={workspace.setorContabil}
                  color="blue"
                />
              )}
              {workspace.setorFiscal && (
                <SetorCard 
                  nome="Fiscal" 
                  info={workspace.setorFiscal}
                  color="purple"
                />
              )}
              {workspace.setorDP && (
                <SetorCard 
                  nome="DP" 
                  info={workspace.setorDP}
                  color="green"
                />
              )}
            </div>
            {!workspace.setorContabil && !workspace.setorFiscal && !workspace.setorDP && (
              <div className="text-center py-8 text-gray-400">
                <Briefcase className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nenhum setor atribuído</p>
              </div>
            )}
          </div>

          {workspace.contact && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Informações de Contato
              </h3>
              <div className="space-y-3">
                {workspace.contact.phone && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Telefone</p>
                      <p className="text-sm font-medium text-gray-800">
                        {workspace.contact.phone}
                      </p>
                    </div>
                  </div>
                )}
                {workspace.contact.email && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">E-mail</p>
                      <p className="text-sm font-medium text-gray-800">
                        {workspace.contact.email}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente auxiliar para InfoCard
interface InfoCardProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  compact?: boolean;
}

function InfoCard({ label, value, icon, compact = false }: InfoCardProps) {
  return (
    <div className={`${compact ? 'bg-white' : 'bg-gray-50'} border border-gray-200 rounded-lg p-3`}>
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <p className="text-xs text-gray-500 font-medium">{label}</p>
      </div>
      <p className="text-sm text-gray-800 font-semibold">{value}</p>
    </div>
  );
}

// Componente auxiliar para SetorCard
interface SetorCardProps {
  nome: string;
  info: {
    responsavel: string;
    status: string;
    classe: string;
  };
  color: 'blue' | 'purple' | 'green';
}

function SetorCard({ nome, info, color }: SetorCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    green: 'bg-green-50 border-green-200 text-green-700',
  };

  const iconColorClasses = {
    blue: 'text-blue-500',
    purple: 'text-purple-500',
    green: 'text-green-500',
  };

  return (
    <div className={`border rounded-lg p-4 ${colorClasses[color]}`}>
      <div className="flex items-center gap-2 mb-3">
        <Shield className={`w-5 h-5 ${iconColorClasses[color]}`} />
        <h4 className="font-semibold">{nome}</h4>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 opacity-70" />
          <div>
            <p className="text-xs opacity-70">Responsável</p>
            <p className="text-sm font-medium">{info.responsavel}</p>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div>
            <p className="opacity-70">Status</p>
            <p className="font-medium">{info.status}</p>
          </div>
          <div className="text-right">
            <p className="opacity-70">Classe</p>
            <p className="font-bold text-lg">{info.classe}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
