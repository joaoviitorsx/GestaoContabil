import { Card } from "antd";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Clock } from "lucide-react";
import MainLayout from "../../layouts/MainLayout";
import { mockUser } from "../../mock/user";
import { atividades, alertas, docsMensais } from "../../mock/dashboard";

function Dashboard() {
  return (
    <MainLayout>
      <div className="mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Dashboard</h1>
          <p className="text-gray-500 text-base mt-2">
            Bem-vindo, <span className="font-semibold">{mockUser.name}</span>!
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl">
            <div className="flex flex-col items-start">
              <span className="text-xl text-gray-500 mb-1">Fornecedores cadastrados</span>
              <span className="text-2xl font-bold text-gray-800 mb-2">12</span>
              <span className="text-xs text-gray-400">Atualizado há 2 horas</span>
            </div>
            </Card>

            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl">
            <div className="flex flex-col items-start">
              <span className="text-xl text-gray-500 mb-1">Empresas cadastradas</span>
              <span className="text-2xl font-bold text-gray-800 mb-2">8</span>
              <span className="text-xs text-gray-400">Atualizado há 1 hora</span>
            </div>
            </Card>

            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl">
            <div className="flex flex-col items-start">
              <span className="text-xl text-gray-500 mb-1">Usuários no sistema</span>
              <span className="text-2xl font-bold text-gray-800 mb-2">25</span>
              <span className="text-xs text-gray-400">Atualizado há 30 minutos</span>
            </div>
            </Card>
        </div>

        <Card title={<span className="text-lg font-semibold text-gray-800">Volume de Documentos</span>} className="mb-8 border border-gray-200 shadow-sm rounded-xl">
          <p className="text-gray-500 mb-4 text-sm">Últimos 6 meses (NF-e, CF-e, SPED)</p>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={docsMensais} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis dataKey="mes" tick={{ fill: "#6B7280", fontSize: 13 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#6B7280", fontSize: 13 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 8, color: "#111827" }}
            labelStyle={{ color: "#6B7280" }}
            cursor={{ fill: "#F3F4F6" }}
          />
          <Legend iconType="circle" wrapperStyle={{ color: "#374151", fontSize: 14 }} />
          <Bar dataKey="nfe" fill="#d37223ff" name="NF-e" radius={[6, 6, 0, 0]} />
          <Bar dataKey="cfe" fill="#3558ceff" name="CF-e" radius={[6, 6, 0, 0]} />
          <Bar dataKey="sped" fill="#5ad44aff" name="SPED" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-8">
          <Card
            title={
              <span className="text-lg font-semibold text-gray-800 flex items-center gap-2"> <Clock size={18} className="mr-2"/> Últimas Atividades</span>
            }
            className="lg:col-span-2 border border-gray-200 shadow-sm rounded-xl"
            bodyStyle={{ padding: 0 }}>
            <ul className="divide-y divide-gray-100">
              {atividades.map((a) => (
          <li key={a.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition">
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 text-xl">
              {a.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 text-sm font-medium truncate">{a.texto}</p>
              <p className="text-xs text-gray-400 mt-0.5">{a.horario}</p>
            </div>
          </li>
              ))}
              {atividades.length === 0 && (
          <li className="px-5 py-6 text-center text-gray-400 text-sm">Nenhuma atividade recente.</li>
              )}
            </ul>
          </Card>

          <Card
            title={
              <span className="text-lg font-semibold text-gray-800 flex items-center gap-2">Pendências & Alertas</span>
            }
            className="border border-gray-200 shadow-sm rounded-xl"
            bodyStyle={{ padding: "1.5rem" }}>
            <div className="space-y-4">
              {alertas.length === 0 ? (
                <div className="text-center text-gray-400 text-sm py-8">
                  Nenhuma pendência ou alerta no momento.
                </div>
              ) : (
                alertas.map((al) => (
                  <div key={al.id}
                    className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 transition hover:shadow-sm">
                    <div className="flex flex-col gap-1 min-w-0">
                      <span className="font-semibold text-gray-900 truncate">{al.titulo}</span>
                      <span className="text-sm text-gray-600 truncate">{al.detalhe}</span>
                    </div>
                    <div className="flex flex-col items-end gap-2 min-w-fit ml-4">
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full border ${
                          al.tipo === "warn"
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {al.tipo === "warn" ? "Aviso" : "Erro"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

export default Dashboard;
