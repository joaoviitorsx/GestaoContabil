import { Plus, Pencil, Trash2, UserPlus  } from "lucide-react";
import Button from "../Button";
import { usuarios } from "../../mock/user";
import { Card } from "antd";
import Modal from "../Modal";
import { useState } from "react";

function UsersTab() {
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
      usuario: "",
      email: "",
      profile: "",
    });

    const handleSave = () => {
      setOpenModal(false);
    };

  return (
    <Card className="overflow-hidden">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <header>
            <h1 className="text-2xl font-bold text-gray-800">
              Usuários do Sistema
            </h1>
          </header>

          <Button onClick={() => setOpenModal(true)} className="flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto">
            <Plus size={16} /> Novo Usuário
          </Button>
        </div>

        <div className="mt-8 overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-[700px] w-full text-left border-collapse">
            <thead className="bg-gray-200">
              <tr className="border-b">
                <th className="py-3 px-4 font-medium text-gray-700">Nome</th>
                <th className="py-3 px-4 font-medium text-gray-700">E-mail</th>
                <th className="py-3 px-4 font-medium text-gray-700">Cargo</th>
                <th className="py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="py-3 px-4 font-medium text-gray-700">Último acesso</th>
                <th className="py-3 px-4 text-right font-medium text-gray-700">Ações</th>
              </tr>
            </thead>

            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors last:border-none">
                  <td className="py-3 px-4">{u.nome}</td>
                  <td className="py-3 px-4">{u.email}</td>
                  <td className="py-3 px-4">{u.cargo}</td>
                  <td className="py-3 px-4">{u.status}</td>
                  <td className="py-3 px-4">{u.ultimoAcesso}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="secondary" className="p-2 rounded-md cursor-pointer" onClick={() => console.log("Editar", u.id)}>
                        <Pencil size={16} />
                      </Button>
                      <Button variant="secondary" className="p-2 rounded-md bg-red-500 hover:bg-red-600 focus:ring-red-500 cursor-pointer" onClick={() => console.log("Excluir", u.id)}>
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
      <Modal
        isOpen={openModal}
        icon={<UserPlus size={20} className="text-blue-600" />}
        title="Adicionar Novo Usuário"
        onClose={() => setOpenModal(false)}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" className="px-5 py-2 rounded-md cursor-pointer" onClick={() => setOpenModal(false)} >Cancelar</Button>
            <Button className="bg-blue-600 text-white px-5 py-2 rounded-md cursor-pointer" onClick={handleSave}>Salvar</Button>
          </div>
        }>
        <form className="space-y-5 mt-2">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nome do Usuário <span className="text-red-500">*</span></label>
            <input type="text" value={formData.usuario} onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
              placeholder="Digite o nome completo" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"/>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">E-mail <span className="text-red-500">*</span></label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="usuario@email.com" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"/>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Cargo <span className="text-red-500">*</span></label>
            <select
              value={formData.profile}
              onChange={(e) => setFormData({ ...formData, profile: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition">
              <option value="">Selecione um cargo</option>
              <option value="Estagiário">Estagiário</option>
              <option value="Fiscal">Fiscal</option>
              <option value="Contabil">Contábil</option>
              <option value="DP">Departamento Pessoal</option>
              <option value="Administrador">Administrador</option>
            </select>
          </div>
        </form>
      </Modal>
    </Card>
  );
}

export default UsersTab;
