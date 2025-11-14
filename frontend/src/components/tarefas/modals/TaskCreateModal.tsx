import { X, Calendar, User, Building2, Tag, AlertCircle, Briefcase, Link as LinkIcon, Lock, Upload, Plus, Pen, Trash } from "lucide-react";
import { useState } from "react";
import Modal from "../../Modal";
import Input from "../../Input";
import type { Task, TaskStatus } from "../../../types/workspace/task";
import type { Workspace } from "../../../types/workspace/workspace";

interface Credential {
  id: string;
  service: string;
  username: string;
  password: string;
  notes?: string;
}

interface AccessLink {
  id: string;
  label: string;
  url: string;
  description?: string;
}

interface TaskCreateModalProps {
  initialStatus: TaskStatus;
  workspace: Workspace;
  grupoNome: string;
  onClose: () => void;
  onCreate: (task: Partial<Task>) => void;
  analistas: string[];
}

export default function TaskCreateModal({
  initialStatus,
  workspace,
  grupoNome,
  onClose,
  onCreate,
  analistas,
}: TaskCreateModalProps) {
  const setoresDisponiveis = ["Contábil", "Fiscal", "DP"];
  const classes = ["A", "B", "C"];
  const statusEmpresa = ["Ativa", "S/Mov"];

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    setor: "",
    analista: "",
    classe: "",
    statusEmpresa: "Ativa",
    prazo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  });

  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [accessLinks, setAccessLinks] = useState<AccessLink[]>([]);
  const [showCredentialForm, setShowCredentialForm] = useState(false);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [newCredential, setNewCredential] = useState({ service: "", username: "", password: "", notes: "" });
  const [newLink, setNewLink] = useState({ label: "", url: "", description: "" });
  const [editingCredential, setEditingCredential] = useState<Credential | null>(null);
  const [deletingCredential, setDeletingCredential] = useState<Credential | null>(null);
  const [editingLink, setEditingLink] = useState<AccessLink | null>(null);
  const [deletingLink, setDeletingLink] = useState<AccessLink | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Título é obrigatório";
    }

    if (!formData.setor) {
      newErrors.setor = "Setor é obrigatório";
    }

    if (!formData.analista) {
      newErrors.analista = "Analista é obrigatório";
    }

    if (!formData.classe) {
      newErrors.classe = "Classe é obrigatória";
    }

    if (!formData.prazo) {
      newErrors.prazo = "Prazo é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCredential = () => {
    if (newCredential.service && newCredential.username && newCredential.password) {
      const credential: Credential = {
        id: `cred-${Date.now()}`,
        service: newCredential.service,
        username: newCredential.username,
        password: newCredential.password,
        notes: newCredential.notes
      };
      setCredentials([...credentials, credential]);
      setNewCredential({ service: "", username: "", password: "", notes: "" });
      setShowCredentialForm(false);
    }
  };

  const handleOpenEditCredential = (cred: Credential) => {
    setEditingCredential({ ...cred });
  };

  const handleSaveCredential = () => {
    if (editingCredential) {
      setCredentials(credentials.map(c => 
        c.id === editingCredential.id ? editingCredential : c
      ));
      setEditingCredential(null);
    }
  };

  const handleOpenDeleteCredential = (cred: Credential) => {
    setDeletingCredential(cred);
  };

  const handleDeleteCredential = () => {
    if (deletingCredential) {
      setCredentials(credentials.filter(c => c.id !== deletingCredential.id));
      setDeletingCredential(null);
    }
  };

  const handleAddLink = () => {
    if (newLink.label && newLink.url) {
      const link: AccessLink = {
        id: `link-${Date.now()}`,
        label: newLink.label,
        url: newLink.url,
        description: newLink.description
      };
      setAccessLinks([...accessLinks, link]);
      setNewLink({ label: "", url: "", description: "" });
      setShowLinkForm(false);
    }
  };

  const handleOpenEditLink = (link: AccessLink) => {
    setEditingLink({ ...link });
  };

  const handleSaveLink = () => {
    if (editingLink) {
      setAccessLinks(accessLinks.map(l => 
        l.id === editingLink.id ? editingLink : l
      ));
      setEditingLink(null);
    }
  };

  const handleOpenDeleteLink = (link: AccessLink) => {
    setDeletingLink(link);
  };

  const handleDeleteLink = () => {
    if (deletingLink) {
      setAccessLinks(accessLinks.filter(l => l.id !== deletingLink.id));
      setDeletingLink(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newTask: Partial<Task> & { metadata?: Record<string, unknown> } = {
      title: formData.title,
      description: formData.description,
      setor: formData.setor,
      responsible: {
        id: formData.analista,
        name: formData.analista,
        role: "Analista",
        avatar: "#3b82f6",
      },
      filial: workspace.razaoSocial,
      dueDate: formData.prazo,
      status: initialStatus,
      accessLinkIds: [],
      attachmentIds: [],
      // Dados customizados (seriam salvos em campos extras ou metadata)
      metadata: {
        grupo: grupoNome,
        classe: formData.classe,
        statusEmpresa: formData.statusEmpresa,
        credentials,
        accessLinks,
      }
    };

    onCreate(newTask);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex-1 pr-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Nova Tarefa</h2>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-semibold">Grupo:</span> {grupoNome}</p>
              <p><span className="font-semibold">Empresa:</span> {workspace.razaoSocial}</p>
              <p className="text-blue-600 font-medium">
                Status: {initialStatus === "backlog" && "A Fazer"}
                {initialStatus === "in-progress" && "Em Andamento"}
                {initialStatus === "in-review" && "Em Revisão"}
                {initialStatus === "done" && "Concluído"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Título da Tarefa *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Ex: Revisar documentos fiscais"
            />
            {errors.title && (
              <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-none"
              placeholder="Descreva os detalhes da tarefa..."
            />
          </div>

          {/* Setor */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Setor *
            </label>
            <select
              value={formData.setor}
              onChange={(e) => {
                setFormData({ ...formData, setor: e.target.value, analista: "" });
                // Limpa o erro do setor quando selecionar
                if (errors.setor) {
                  const newErrors = { ...errors };
                  delete newErrors.setor;
                  setErrors(newErrors);
                }
              }}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow ${
                errors.setor ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Selecione o setor...</option>
              {setoresDisponiveis.map((setor) => (
                <option key={setor} value={setor}>
                  {setor}
                </option>
              ))}
            </select>
            {errors.setor && (
              <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.setor}
              </p>
            )}
          </div>

          {/* Analista - Só aparece após selecionar o setor */}
          {formData.setor && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Analista Responsável *
              </label>
              <select
                value={formData.analista}
                onChange={(e) => setFormData({ ...formData, analista: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow ${
                  errors.analista ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Selecione o analista...</option>
                {analistas.map((analista) => (
                  <option key={analista} value={analista}>
                    {analista}
                  </option>
                ))}
              </select>
              {errors.analista && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.analista}
                </p>
              )}
            </div>
          )}

          {/* Classe e Status da Empresa */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Classe *
              </label>
              <select
                value={formData.classe}
                onChange={(e) => setFormData({ ...formData, classe: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow ${
                  errors.classe ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Selecione a classe...</option>
                {classes.map((classe) => (
                  <option key={classe} value={classe}>
                    Classe {classe}
                  </option>
                ))}
              </select>
              {errors.classe && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.classe}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Status da Empresa
              </label>
              <select
                value={formData.statusEmpresa}
                onChange={(e) => setFormData({ ...formData, statusEmpresa: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
              >
                {statusEmpresa.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Prazo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Prazo *
            </label>
            <input
              type="date"
              value={formData.prazo}
              onChange={(e) => setFormData({ ...formData, prazo: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow ${
                errors.prazo ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.prazo && (
              <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.prazo}
              </p>
            )}
          </div>

          {/* Credenciais */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Credenciais (Opcional)
              </h3>
              <button
                type="button"
                onClick={() => setShowCredentialForm(true)}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Adicionar
              </button>
            </div>

            {showCredentialForm && (
              <div className="p-4 bg-gray-50 rounded-lg space-y-3 mb-4 border border-gray-200">
                <Input
                  type="text"
                  placeholder="Nome do Sistema"
                  value={newCredential.service}
                  onChange={(e) => setNewCredential({ ...newCredential, service: e.target.value })}
                />
                <Input
                  type="text"
                  placeholder="Usuário"
                  value={newCredential.username}
                  onChange={(e) => setNewCredential({ ...newCredential, username: e.target.value })}
                />
                <Input
                  type="password"
                  placeholder="Senha"
                  value={newCredential.password}
                  onChange={(e) => setNewCredential({ ...newCredential, password: e.target.value })}
                />
                <textarea
                  placeholder="Observações (opcional)"
                  value={newCredential.notes}
                  onChange={(e) => setNewCredential({ ...newCredential, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  rows={2}
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleAddCredential}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer"
                  >
                    Adicionar
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCredentialForm(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {credentials.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {credentials.map((cred) => (
                  <div key={cred.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditCredential(cred)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Pen className="w-4 h-4 text-gray-500" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDeleteCredential(cred)}
                          className="p-1.5 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Excluir"
                        >
                          <Trash className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-gray-800 mb-3">{cred.service}</h3>

                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <p className="text-xs text-gray-500 font-medium mb-1">Usuário</p>
                      <p className="text-sm font-mono font-semibold text-gray-800 truncate">
                        {cred.username}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-xs text-gray-500 font-medium mb-1">Senha</p>
                      <p className="text-sm font-mono font-semibold text-gray-800">
                        {"•".repeat(cred.password.length)}
                      </p>
                    </div>

                    {cred.notes && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-xs text-blue-600 font-medium mb-1">Observações</p>
                        <p className="text-xs text-gray-700 line-clamp-2">{cred.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : null}
          </section>

          {/* Acessos Úteis */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-blue-600" />
                Acessos Úteis (Opcional)
              </h3>
              <button
                type="button"
                onClick={() => setShowLinkForm(true)}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Adicionar
              </button>
            </div>

            {showLinkForm && (
              <div className="p-4 bg-blue-50 rounded-lg space-y-3 mb-4 border border-blue-200">
                <Input
                  type="text"
                  placeholder="Nome do Link"
                  value={newLink.label}
                  onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
                  maxLength={35}
                />
                <Input
                  type="url"
                  placeholder="URL (https://...)"
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                />
                <textarea
                  placeholder="Descrição (opcional)"
                  value={newLink.description}
                  onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={2}
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleAddLink}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                  >
                    Adicionar
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowLinkForm(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {accessLinks.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {accessLinks.map((link) => (
                  <div key={link.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <LinkIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditLink(link)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Pen className="w-4 h-4 text-gray-500" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDeleteLink(link)}
                          className="p-1.5 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Excluir"
                        >
                          <Trash className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-gray-800 mb-3">{link.label}</h3>
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-xs text-gray-500 font-medium mb-1">URL</p>
                      <p className="text-sm text-blue-600 hover:underline truncate">
                        {link.url}
                      </p>
                    </div>

                    {link.description && link.description.trim() && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-xs text-blue-600 font-medium mb-1">Descrição</p>
                        <p className="text-xs text-gray-700 line-clamp-2">{link.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : null}
          </section>

          {/* Anexos (Opcional) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Anexos (Opcional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Clique para adicionar arquivos</p>
              <p className="text-xs text-gray-400 mt-1">ou arraste e solte aqui</p>
            </div>
          </div>
        </div>

        {/* Modais de Credenciais */}
        <Modal
          isOpen={!!editingCredential}
          onClose={() => setEditingCredential(null)}
          icon={<Pen className="w-5 h-5 text-purple-600" />}
          title="Editar Credencial"
          width="max-w-md"
        >
          <div className="space-y-3">
            <Input
              type="text"
              placeholder="Nome do Sistema"
              value={editingCredential?.service || ""}
              onChange={(e) => editingCredential && setEditingCredential({ ...editingCredential, service: e.target.value })}
            />
            <Input
              type="text"
              placeholder="Usuário"
              value={editingCredential?.username || ""}
              onChange={(e) => editingCredential && setEditingCredential({ ...editingCredential, username: e.target.value })}
            />
            <Input
              type="password"
              placeholder="Senha"
              value={editingCredential?.password || ""}
              onChange={(e) => editingCredential && setEditingCredential({ ...editingCredential, password: e.target.value })}
            />
            <textarea
              placeholder="Observações (opcional)"
              value={editingCredential?.notes || ""}
              onChange={(e) => editingCredential && setEditingCredential({ ...editingCredential, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              rows={2}
            />
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSaveCredential}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition cursor-pointer"
            >
              Salvar
            </button>
            <button
              onClick={() => setEditingCredential(null)}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </Modal>

        <Modal
          isOpen={!!deletingCredential}
          onClose={() => setDeletingCredential(null)}
          icon={
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Trash className="w-6 h-6 text-red-600" />
            </div>
          }
          title="Excluir Credencial"
          width="max-w-md"
        >
          <p className="text-sm text-gray-500 mb-4">Esta ação não pode ser desfeita</p>
          <p className="text-sm text-gray-600 mb-6">
            Tem certeza que deseja excluir a credencial <strong>{deletingCredential?.service}</strong>?
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDeleteCredential}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition cursor-pointer"
            >
              Excluir
            </button>
            <button
              onClick={() => setDeletingCredential(null)}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </Modal>

        {/* Modais de Links */}
        <Modal
          isOpen={!!editingLink}
          onClose={() => setEditingLink(null)}
          icon={<Pen className="w-5 h-5 text-blue-600" />}
          title="Editar Link"
          width="max-w-md"
        >
          <div className="space-y-3">
            <Input
              type="text"
              placeholder="Nome do Link"
              value={editingLink?.label || ""}
              onChange={(e) => editingLink && setEditingLink({ ...editingLink, label: e.target.value })}
            />
            <Input
              type="url"
              placeholder="URL"
              value={editingLink?.url || ""}
              onChange={(e) => editingLink && setEditingLink({ ...editingLink, url: e.target.value })}
            />
            <textarea
              placeholder="Descrição (opcional)"
              value={editingLink?.description || ""}
              onChange={(e) => editingLink && setEditingLink({ ...editingLink, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={2}
            />
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSaveLink}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
            >
              Salvar
            </button>
            <button
              onClick={() => setEditingLink(null)}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </Modal>

        <Modal
          isOpen={!!deletingLink}
          onClose={() => setDeletingLink(null)}
          icon={
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Trash className="w-6 h-6 text-red-600" />
            </div>
          }
          title="Excluir Link"
          width="max-w-md"
        >
          <p className="text-sm text-gray-500 mb-4">Esta ação não pode ser desfeita</p>
          <p className="text-sm text-gray-600 mb-6">
            Tem certeza que deseja excluir o link <strong>{deletingLink?.label}</strong>?
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDeleteLink}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition cursor-pointer"
            >
              Excluir
            </button>
            <button
              onClick={() => setDeletingLink(null)}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </Modal>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Criar Tarefa
          </button>
        </div>
      </div>
    </div>
  );
}
