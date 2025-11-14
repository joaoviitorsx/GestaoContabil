import { useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { UserCog, Lock } from "lucide-react";
import Tabs from "../../components/Tabs";
import UsersTab from "../../components/tab/UsersTab";
import PermissionsTab from "../../components/tab/PermissionsTab";

function AdminPage() {
  const [activeTab, setActiveTab] = useState("users");

  const tabItems = [
    { value: "users", label: "Usuários", icon: <UserCog size={18} /> },
    { value: "permissions", label: "Permissões", icon: <Lock size={18} /> },
  ];

  return (
    <MainLayout>
      <div className="mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            Painel Administrativo
          </h1>
          <p className="text-gray-500 text-base mt-2">
            Gerencie usuários e permissões do sistema
          </p>
        </header>

        <Tabs
          tabs={tabItems}
          defaultValue="users"
          onChange={(value) => setActiveTab(value)}
        />

        <div className="mt-6">
          {activeTab === "users" && <UsersTab />}
          {activeTab === "permissions" && <PermissionsTab />}
        </div>
      </div>

    </MainLayout>
  );
}

export default AdminPage;
