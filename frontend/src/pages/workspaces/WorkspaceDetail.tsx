import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckSquare, Building2, TreePine, Info} from "lucide-react";
import MainLayout from "../../layouts/MainLayout";
import { workspacesMock } from "../../mock/workspaces";
import WorkspaceKanban from "../../components/workspace/WorkspaceKanban";
import WorkspaceInfo from "../../components/workspace/WorkspaceInfo";
import WorkspaceBranches from "../../components/workspace/WorkspaceFilial";

type TabType = "tasks" | "info" | "branches" | "access" | "credentials" | "documents";

interface TabConfig {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

function WorkspaceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("tasks");

  const workspace = workspacesMock.find((w) => w.id === id);

  if (!workspace) {
    return (
      <MainLayout>
        <div className="text-center py-12 cursor-pointer">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Empresa não encontrada</h2>
          <p className="text-gray-500 mb-6">A empresa que você está procurando não existe.</p>
          <button
            onClick={() => navigate("/workspaces")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Voltar para Empresas
          </button>
        </div>
      </MainLayout>
    );
  }

  const tabs: TabConfig[] = [
    { id: "tasks", label: "Tarefas", icon: CheckSquare, badge: workspace.totalTasks },
    { id: "info", label: "Informações", icon: Info },
    { id: "branches", label: "Filiais", icon: TreePine, badge: workspace.filiais.length },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "tasks":
        return <WorkspaceKanban workspace={workspace} />;
      case "info":
        return <WorkspaceInfo workspace={workspace} />;
      case "branches":
        return <WorkspaceBranches workspace={workspace} />;
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
        <aside className="lg:w-80 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-4 border-b border-gray-100">
              <button onClick={() => navigate("/workspaces")} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-4 cursor-pointer">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Voltar para Empresas</span>
              </button>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: `${workspace.color}15` }}>
                  <Building2 className="w-6 h-6" style={{ color: workspace.color }} strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-gray-800 truncate">
                    {workspace.nomeFantasia}
                  </h2>
                  <p className="text-xs text-gray-500 truncate">{workspace.razaoSocial}</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto p-2">
              <div className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left cursor-pointer
                        ${
                          isActive
                            ? "text-white font-semibold shadow-md"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                        }`}
                      style={
                        isActive
                          ? {
                              background: `linear-gradient(135deg, ${workspace.color}, ${workspace.color}dd)`,
                            }
                          : {}
                      }
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span className="text-sm">{tab.label}</span>
                      </div>
                      {tab.badge !== undefined && (
                        <span
                          className={`
                          px-2 py-0.5 rounded-full text-xs font-bold
                          ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-gray-100 text-gray-600"
                          }
                        `}
                        >
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </nav>

            <div className="p-2 border-t text-white"
              style={{
                background: `linear-gradient(135deg, ${workspace.color}, ${workspace.color}dd)`,
              }}>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm h-full p-6">
            {renderTabContent()}
          </div>
        </main>
      </div>
    </MainLayout>
  );
}

export default WorkspaceDetail;
