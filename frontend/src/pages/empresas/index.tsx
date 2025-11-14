import { useState } from "react";
import { Card } from "antd";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import MainLayout from "../../layouts/MainLayout";
import { Pencil, Plus, Trash2, Building } from "lucide-react";
import { empresas } from "../../mock/empresas";

function EmpresasPage() {
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    cnpj: "",
    regime: "",
    uf: "",
    status: "Ativa",
  });

  const handleSave = () => {
    setOpenModal(false);
  };

  return (
    <MainLayout>
      <div className="mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight flex items-center gap-2">Empresas</h1>
          <p className="text-gray-500 text-base mt-2"> Gerenciamento de empresas no sistema</p>
        </header>

        <Card className="overflow-hidden">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <header>
                <h2 className="text-2xl font-bold text-gray-800">
                  Lista de Empresas
                </h2>
              </header>

              <Button onClick={() => setOpenModal(true)} className="flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto">
                <Plus size={16} />
                Nova Empresa
              </Button>
            </div>

            <div className="mt-8 overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-[700px] w-full text-left border-collapse">
                <thead className="bg-gray-200">
                  <tr className="border-b">
                    <th className="py-3 px-4 font-medium text-gray-700">Nome</th>
                    <th className="py-3 px-4 font-medium text-gray-700">CNPJ</th>
                    <th className="py-3 px-4 font-medium text-gray-700">
                      Regime Tributário
                    </th>
                    <th className="py-3 px-4 font-medium text-gray-700 text-center">
                      UF
                    </th>
                    <th className="py-3 px-4 font-medium text-gray-700 text-center">
                      Status
                    </th>
                    <th className="py-3 px-4 text-right font-medium text-gray-700">
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {empresas.map((e) => (
                    <tr
                      key={e.id}
                      className="hover:bg-gray-50 transition-colors last:border-none"
                    >
                      <td className="py-3 px-4 text-gray-800 font-medium">
                        {e.nome}
                      </td>
                      <td className="py-3 px-4">{e.cnpj}</td>
                      <td className="py-3 px-4">{e.regime}</td>
                      <td className="py-3 px-4 text-center">{e.uf}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${
                            e.status === "Ativa"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }`}>
                          {e.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="secondary" className="p-2 rounded-md cursor-pointer"
                            onClick={() => console.log("Editar", e.id)}>
                            <Pencil size={16} />
                          </Button>
                          <Button variant="secondary" className="p-2 rounded-md bg-red-500 hover:bg-red-600 focus:ring-red-500 cursor-pointer"
                            onClick={() => console.log("Excluir", e.id)}>
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        <Modal
          isOpen={openModal}
          icon={<Building size={20} className="text-blue-600" />}
          title="Adicionar nova Empresa"
          onClose={() => setOpenModal(false)}
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="secondary" className="px-5 py-2 rounded-md cursor-pointer" onClick={() => setOpenModal(false)}>Cancelar</Button>
              <Button className="bg-blue-600 text-white px-5 py-2 rounded-md cursor-pointer" onClick={handleSave}>Salvar</Button>
            </div>
          }>
          <form
            className="space-y-5 mt-2"
            onSubmit={e => { e.preventDefault();handleSave()}}>
            <div>
              <label htmlFor="nome" className="block text-sm font-semibold text-gray-700 mb-1">Nome da Empresa <span className="text-red-500">*</span></label>
              <input
                id="nome"
                type="text"
                value={formData.nome}
                onChange={e => setFormData({ ...formData, nome: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="Digite o nome da empresa"
                required/>
            </div>

            <div>
              <label htmlFor="cnpj" className="block text-sm font-semibold text-gray-700 mb-1">CNPJ <span className="text-red-500">*</span></label>
              <input
                id="cnpj"
                type="text"
                value={formData.cnpj}
                onChange={e => setFormData({ ...formData, cnpj: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="00.000.000/0000-00"
                required/>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="regime" className="block text-sm font-semibold text-gray-700 mb-1">Regime Tributário <span className="text-red-500">*</span></label>
                <select
                  id="regime"
                  value={formData.regime}
                  onChange={e => setFormData({ ...formData, regime: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  required>
                  <option value="">Selecione</option>
                  <option value="Simples ">Simples</option>
                  <option value="Decreto">Decreto</option>
                </select>
              </div>
              <div>
                <label htmlFor="uf" className="block text-sm font-semibold text-gray-700 mb-1">
                  UF <span className="text-red-500">*</span>
                </label>
                <select
                  id="uf"
                  value={formData.uf}
                  onChange={e => setFormData({ ...formData, uf: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  required>
                  <option value="">Selecione</option>
                  <option value="CE">CE</option>
                  <option value="SP">SP</option>
                  <option value="RJ">RJ</option>
                  <option value="MG">MG</option>
                  <option value="ES">ES</option>
                </select>
              </div>
            </div>
          </form>
        </Modal>
      </div>
    </MainLayout>
  );
}

export default EmpresasPage;
