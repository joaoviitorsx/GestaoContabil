import Switch from "../Switch";
import Button from "../Button";
import { modulos } from "../../mock/user";
import { Card } from "antd";

function PermissionsTab() {
  return (
    <Card className="overflow-hidden">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <header>
            <h1 className="text-2xl font-bold text-gray-800">
              Permissões do Sistema
            </h1>
          </header>

          <Button className="flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto">
            Salvar Permissões
          </Button>
        </div>

        <div className="mt-8 overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-[500px] w-full text-left border-collapse">
            <thead className="bg-gray-200">
              <tr className="border-b">
                <th className="py-3 px-4 font-medium text-gray-700">
                  Módulo
                </th>
                <th className="py-3 px-4 font-medium text-gray-700 text-center">
                  Admin
                </th>
                <th className="py-3 px-4 font-medium text-gray-700 text-center">
                  Contábil
                </th>
                <th className="py-3 px-4 font-medium text-gray-700 text-center">
                  Fiscal
                </th>
              </tr>
            </thead>
            <tbody>
              {modulos.map((m, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors last:border-none">
                  <td className="py-3 px-4 text-gray-800">{m.nome}</td>
                  <td className="py-3 px-4 text-center">
                    <Switch checked={m.admin} onChange={(v) => console.log("Admin:", v)}/>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Switch checked={m.contador} onChange={(v) => console.log("Contador:", v)}/>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Switch checked={m.analista} onChange={(v) => console.log("Analista:", v)}/>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}

export default PermissionsTab;
