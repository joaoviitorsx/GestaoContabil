import { useState } from "react";
import { X, Calendar, User, KeyRound, Plus, Paperclip, Upload, ExternalLink, Trash, Download, Pen, Eye, EyeOff, Copy, Check } from "lucide-react"; import type { Workspace, TaskStatus, Setor, Credential, AccessLink, Document } from "../../types/workspace";
import Modal from "../Modal";

interface TaskCreateModalProps {
  workspace: Workspace;
  onClose: () => void;
  initialStatus?: TaskStatus;
  onSave: (taskData: TaskFormData) => void;
}

export interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  setor: Setor;
  filial: string;
  responsible: {
    name: string;
    role: string;
    avatar?: string;
  };
  dueDate: string;
  accessLinkIds: string[];
  attachmentIds: string[];
}

function TaskCreateModal({
  workspace,
  onClose,
  initialStatus = "backlog",
  onSave,
}: TaskCreateModalProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    status: initialStatus,
    setor: workspace.setor,
    filial: workspace.filiais[0]?.name || "",
    responsible: {
      name: "",
      role: "",
      avatar: "",
    },
    dueDate: "",
    accessLinkIds: [],
    attachmentIds: [],
  });

  // Estados para credenciais
  const [localCredentials, setLocalCredentials] = useState<Credential[]>([]);
  const [isAddCredentialModalOpen, setIsAddCredentialModalOpen] = useState(false);
  const [isEditCredentialModalOpen, setIsEditCredentialModalOpen] = useState(false);
  const [isDeleteCredentialModalOpen, setIsDeleteCredentialModalOpen] = useState(false);
  const [editingCredential, setEditingCredential] = useState<Credential | null>(null);
  const [deletingCredential, setDeletingCredential] = useState<Credential | null>(null);
  const [newCredential, setNewCredential] = useState<Omit<Credential, 'id'>>({
    system: "",
    url: "",
    username: "",
    password: "",
    notes: ""
  });

  // Estados para links de acesso
  const [localAccessLinks, setLocalAccessLinks] = useState<AccessLink[]>([]);
  const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState(false);
  const [isEditLinkModalOpen, setIsEditLinkModalOpen] = useState(false);
  const [isDeleteLinkModalOpen, setIsDeleteLinkModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<AccessLink | null>(null);
  const [deletingLink, setDeletingLink] = useState<AccessLink | null>(null);
  const [newLink, setNewLink] = useState<Omit<AccessLink, 'id'>>({
    name: "",
    url: "",
    description: "",
    icon: "link"
  });

  // Estados para anexos
  const [localAttachments, setLocalAttachments] = useState<Document[]>([]);
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  // Estados para UI
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  // Handlers gerais
  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates({ [id]: true });
    setTimeout(() => setCopiedStates({ [id]: false }), 2000);
  };

  const togglePassword = (id: string) =>
    setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      accessLinkIds: localAccessLinks.map(l => l.id),
      attachmentIds: localAttachments.map(d => d.id),
    });
  };

  // Handlers para credenciais
  const handleOpenAddCredential = () => {
    setNewCredential({ system: "", url: "", username: "", password: "", notes: "" });
    setIsAddCredentialModalOpen(true);
  };

  const handleOpenEditCredential = (cred: Credential) => {
    setEditingCredential(cred);
    setIsEditCredentialModalOpen(true);
  };

  const handleOpenDeleteCredential = (cred: Credential) => {
    setDeletingCredential(cred);
    setIsDeleteCredentialModalOpen(true);
  };

  const handleSaveNewCredential = () => {
    const credential: Credential = {
      id: `cred-${Date.now()}`,
      ...newCredential
    };
    setLocalCredentials([...localCredentials, credential]);
    setIsAddCredentialModalOpen(false);
    setNewCredential({ system: "", url: "", username: "", password: "", notes: "" });
  };

  const handleUpdateCredential = () => {
    if (!editingCredential) return;
    setLocalCredentials(localCredentials.map(c => 
      c.id === editingCredential.id ? editingCredential : c
    ));
    setIsEditCredentialModalOpen(false);
    setEditingCredential(null);
  };

  const handleDeleteCredential = () => {
    if (!deletingCredential) return;
    setLocalCredentials(localCredentials.filter(c => c.id !== deletingCredential.id));
    setIsDeleteCredentialModalOpen(false);
    setDeletingCredential(null);
  };

  // Handlers para links de acesso
  const handleOpenAddLink = () => {
    setNewLink({ name: "", url: "", description: "", icon: "link" });
    setIsAddLinkModalOpen(true);
  };

  const handleOpenEditLink = (link: AccessLink) => {
    setEditingLink(link);
    setIsEditLinkModalOpen(true);
  };

  const handleOpenDeleteLink = (link: AccessLink) => {
    setDeletingLink(link);
    setIsDeleteLinkModalOpen(true);
  };

  const handleSaveNewLink = () => {
    const link: AccessLink = {
      id: `link-${Date.now()}`,
      ...newLink
    };
    setLocalAccessLinks([...localAccessLinks, link]);
    setIsAddLinkModalOpen(false);
    setNewLink({ name: "", url: "", description: "", icon: "link" });
  };

  const handleUpdateLink = () => {
    if (!editingLink) return;
    setLocalAccessLinks(localAccessLinks.map(l => 
      l.id === editingLink.id ? editingLink : l
    ));
    setIsEditLinkModalOpen(false);
    setEditingLink(null);
  };

  const handleDeleteLink = () => {
    if (!deletingLink) return;
    setLocalAccessLinks(localAccessLinks.filter(l => l.id !== deletingLink.id));
    setIsDeleteLinkModalOpen(false);
    setDeletingLink(null);
  };

  // Handler para upload de arquivos
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingFile(true);
    
    const newAttachments = Array.from(files).map((file) => ({
      id: `doc-${Date.now()}-${Math.random()}`,
      name: file.name,
      type: file.type || "application/octet-stream",
      size: `${(file.size / 1024).toFixed(2)} KB`,
      url: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString().split("T")[0],
      uploadedBy: formData.responsible.name || "Admin",
    }));

    setLocalAttachments([...localAttachments, ...newAttachments]);
    setIsUploadingFile(false);
    event.target.value = "";
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[70] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-1">Nova Tarefa</h2>
            <p className="text-sm text-gray-500">
              Preencha os detalhes para criar uma tarefa completa
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition cursor-pointer">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              Informações Básicas
              </h3>

              <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                Título da Tarefa *
                </label>
                <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Apuração de ICMS - Março/2025"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descrição Detalhada *
                </label>
                <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva em detalhes o que precisa ser feito, requisitos, observações importantes..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Filial *
                </label>
                <select
                  required
                  value={formData.filial}
                  onChange={(e) => setFormData({ ...formData, filial: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Empresa</option>
                  {workspace.filiais.map((filial) => (
                    <option key={filial.id} value={filial.name}>
                      {filial.name}
                    </option>
                  ))}
                </select>
                </div>

                <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Data de Entrega *
                </label>
                <input
                  type="date"
                  required
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                </div>
              </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-purple-600" />
              Responsável pela Tarefa
              </h3>
              <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Selecionar Usuário Responsável *
              </label>
              <select
                required
                value={formData.responsible.name}
                onChange={(e) => {
                // MOCK DE USUÁRIOS
                const mockUsuarios = [
                  { id: "1", name: "João Silva", role: "Contador", avatar: "" },
                  { id: "2", name: "Maria Souza", role: "Assistente", avatar: "" },
                  { id: "3", name: "Carlos Lima", role: "Analista", avatar: "" },
                ];
                const selectedUser = mockUsuarios.find(u => u.name === e.target.value);
                setFormData({
                  ...formData,
                  responsible: selectedUser
                  ? { name: selectedUser.name, role: selectedUser.role, avatar: selectedUser.avatar }
                  : { name: "", role: "", avatar: "" }
                });
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>Selecione um usuário</option>
                {/* MOCK DE USUÁRIOS */}
                <option value="João Silva">João Silva - Contador</option>
                <option value="Maria Souza">Maria Souza - Assistente</option>
                <option value="Carlos Lima">Carlos Lima - Analista</option>
              </select>
              </div>
            </div>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-700 uppercase flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-blue-600" /> Acessos Úteis
                  {localAccessLinks.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
                      {localAccessLinks.length}
                    </span>
                  )}
                </h3>
                <button
                  type="button"
                  onClick={handleOpenAddLink}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Novo Acesso
                </button>
              </div>

              {localAccessLinks.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {localAccessLinks.map((link) => (
                    <div
                      key={link.id}
                      className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                          <ExternalLink className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => copy(link.url, `link-${link.id}`)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            title="Copiar URL"
                          >
                            {copiedStates[`link-${link.id}`] ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-500" />
                            )}
                          </button>
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

                      <h4 className="font-semibold text-gray-800 mb-2">{link.name}</h4>

                      {link.description && (
                        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                          {link.description}
                        </p>
                      )}

                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        Acessar
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                  <ExternalLink className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Nenhum acesso adicionado</p>
                </div>
              )}
            </section>

            {/* Credenciais */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-700 uppercase flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-yellow-600" /> Credenciais
                  {localCredentials.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-purple-100 text-yellow-700 rounded-full">
                      {localCredentials.length}
                    </span>
                  )}
                </h3>
                <button
                  type="button"
                  onClick={handleOpenAddCredential}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Nova Credencial
                </button>
              </div>

              {localCredentials.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {localCredentials.map((cred) => (
                    <div
                      key={cred.id}
                      className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                          <KeyRound className="w-5 h-5 text-yellow-600" />
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

                      <h3 className="text-base font-bold text-gray-800 mb-1">{cred.system}</h3>
                      {cred.url && (
                        <a
                          href={cred.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1 mb-4"
                        >
                          Acessar sistema
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}

                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs text-gray-500 font-medium">Usuário</p>
                          <button
                            type="button"
                            onClick={() => copy(cred.username, `u${cred.id}`)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors cursor-pointer"
                            title="Copiar usuário"
                          >
                            {copiedStates[`u${cred.id}`] ? (
                              <Check className="w-3 h-3 text-green-600" />
                            ) : (
                              <Copy className="w-3 h-3 text-gray-500" />
                            )}
                          </button>
                        </div>
                        <p className="text-sm font-mono font-semibold text-gray-800 truncate">
                          {cred.username}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs text-gray-500 font-medium">Senha</p>
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => togglePassword(cred.id)}
                              className="p-1 hover:bg-gray-200 rounded transition-colors cursor-pointer"
                              title={showPasswords[cred.id] ? "Ocultar senha" : "Mostrar senha"}
                            >
                              {showPasswords[cred.id] ? (
                                <EyeOff className="w-3 h-3 text-gray-500" />
                              ) : (
                                <Eye className="w-3 h-3 text-gray-500" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => copy(cred.password, `p${cred.id}`)}
                              className="p-1 hover:bg-gray-200 rounded transition-colors cursor-pointer"
                              title="Copiar senha"
                            >
                              {copiedStates[`p${cred.id}`] ? (
                                <Check className="w-3 h-3 text-green-600" />
                              ) : (
                                <Copy className="w-3 h-3 text-gray-500" />
                              )}
                            </button>
                          </div>
                        </div>
                        <p className="text-sm font-mono font-semibold text-gray-800">
                          {showPasswords[cred.id] ? cred.password : "•".repeat(cred.password.length)}
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
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                  <KeyRound className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Nenhuma credencial adicionada</p>
                </div>
              )}
            </section>

            <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-green-600" /> 
                Anexos
                {localAttachments.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                    {localAttachments.length}
                  </span>
                )}
              </h3>
              <label className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition cursor-pointer">
                <Upload className="w-4 h-4" />
                {isUploadingFile ? "Enviando..." : "Adicionar Anexo"}
                <input
                type="file"
                multiple
                onChange={handleFileUpload}
                disabled={isUploadingFile}
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif"
                />
              </label>
            </div>

            {localAttachments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {localAttachments.map((doc) => (
                <div
                key={doc.id}
                className="group bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-green-200 transition-all duration-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Paperclip className="w-6 h-6 text-green-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 truncate mb-1" title={doc.name}>
                        {doc.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="px-2 py-0.5 bg-gray-100 rounded">{doc.size}</span>
                        <span>•</span>
                        <span className="truncate">{doc.type}</span>
                      </div>
                      {doc.uploadedAt && (
                        <p className="text-xs text-gray-400 mt-1">
                          Enviado em {new Date(doc.uploadedAt).toLocaleDateString("pt-BR")}
                        </p>
                      )}
                    </div>

                    {/* Botões de ação */}
                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => window.open(doc.url, "_blank")}
                        className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition flex-shrink-0"
                        title="Baixar"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer transition flex-shrink-0"
                        title="Excluir"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Paperclip className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">Nenhum anexo adicionado</p>
                <p className="text-xs text-gray-500">Clique em "Adicionar Anexo" para enviar arquivos</p>
              </div>
            )}
            </section>
          </div>
        </form>

        <div className="p-6 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg transition-colors font-medium cursor-pointer">
            Cancelar
          </button>
            <button
            type="submit"
            onClick={handleSubmit}
            className="px-8 py-3 bg-gradient-to-r bg-green-600 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-colors font-semibold flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Criar Tarefa
            </button>
        </div>
      </div>

      {isAddCredentialModalOpen && (
        <Modal
          isOpen={isAddCredentialModalOpen}
          onClose={() => setIsAddCredentialModalOpen(false)}
          title="Nova Credencial"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveNewCredential();
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sistema *
              </label>
              <input
                type="text"
                value={newCredential.system}
                onChange={(e) =>
                  setNewCredential({ ...newCredential, system: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Nome do sistema"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL
              </label>
              <input
                type="url"
                value={newCredential.url || ""}
                onChange={(e) =>
                  setNewCredential({ ...newCredential, url: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="https://exemplo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Usuário *
              </label>
              <input
                type="text"
                value={newCredential.username}
                onChange={(e) =>
                  setNewCredential({ ...newCredential, username: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Nome de usuário"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha *
              </label>
              <input
                type="password"
                value={newCredential.password}
                onChange={(e) =>
                  setNewCredential({ ...newCredential, password: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Senha"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas
              </label>
              <textarea
                value={newCredential.notes || ""}
                onChange={(e) =>
                  setNewCredential({ ...newCredential, notes: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                placeholder="Informações adicionais..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsAddCredentialModalOpen(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors cursor-pointer"
              >
                Adicionar
              </button>
            </div>
          </form>
        </Modal>
      )}

      {isEditCredentialModalOpen && editingCredential && (
        <Modal
          isOpen={isEditCredentialModalOpen}
          onClose={() => {
            setIsEditCredentialModalOpen(false);
            setEditingCredential(null);
          }}
          title="Editar Credencial"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateCredential();
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sistema *
              </label>
              <input
                type="text"
                value={editingCredential.system}
                onChange={(e) =>
                  setEditingCredential({ ...editingCredential, system: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Nome do sistema"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL
              </label>
              <input
                type="url"
                value={editingCredential.url || ""}
                onChange={(e) =>
                  setEditingCredential({ ...editingCredential, url: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="https://exemplo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Usuário *
              </label>
              <input
                type="text"
                value={editingCredential.username}
                onChange={(e) =>
                  setEditingCredential({ ...editingCredential, username: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Nome de usuário"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha *
              </label>
              <input
                type="password"
                value={editingCredential.password}
                onChange={(e) =>
                  setEditingCredential({ ...editingCredential, password: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Senha"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas
              </label>
              <textarea
                value={editingCredential.notes || ""}
                onChange={(e) =>
                  setEditingCredential({ ...editingCredential, notes: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                placeholder="Informações adicionais..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsEditCredentialModalOpen(false);
                  setEditingCredential(null);
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Salvar
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal: Confirmar Exclusão de Credencial */}
      {isDeleteCredentialModalOpen && deletingCredential && (
        <Modal
          isOpen={isDeleteCredentialModalOpen}
          onClose={() => {
            setIsDeleteCredentialModalOpen(false);
            setDeletingCredential(null);
          }}
          title="Confirmar Exclusão"
        >
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <Trash className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  Tem certeza que deseja excluir esta credencial?
                </p>
                <p className="text-sm text-red-600 mt-1">
                  <strong>{deletingCredential.system}</strong>
                </p>
                <p className="text-xs text-red-500 mt-2">
                  Esta ação não pode ser desfeita.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteCredentialModalOpen(false);
                  setDeletingCredential(null);
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteCredential}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash className="w-4 h-4" />
                Excluir
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Adicionar Acesso */}
      {isAddLinkModalOpen && (
        <Modal
          isOpen={isAddLinkModalOpen}
          onClose={() => setIsAddLinkModalOpen(false)}
          title="Novo Acesso Útil"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveNewLink();
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome *
              </label>
              <input
                type="text"
                value={newLink.name}
                onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nome do acesso"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL *
              </label>
              <input
                type="url"
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://exemplo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                value={newLink.description || ""}
                onChange={(e) =>
                  setNewLink({ ...newLink, description: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Informações adicionais..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsAddLinkModalOpen(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Adicionar
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal: Editar Acesso */}
      {isEditLinkModalOpen && editingLink && (
        <Modal
          isOpen={isEditLinkModalOpen}
          onClose={() => {
            setIsEditLinkModalOpen(false);
            setEditingLink(null);
          }}
          title="Editar Acesso Útil"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateLink();
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome *
              </label>
              <input
                type="text"
                value={editingLink.name}
                onChange={(e) =>
                  setEditingLink({ ...editingLink, name: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nome do acesso"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL *
              </label>
              <input
                type="url"
                value={editingLink.url}
                onChange={(e) =>
                  setEditingLink({ ...editingLink, url: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://exemplo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                value={editingLink.description || ""}
                onChange={(e) =>
                  setEditingLink({ ...editingLink, description: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Informações adicionais..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsEditLinkModalOpen(false);
                  setEditingLink(null);
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Salvar
              </button>
            </div>
          </form>
        </Modal>
      )}

      {isDeleteLinkModalOpen && deletingLink && (
        <Modal
          isOpen={isDeleteLinkModalOpen}
          onClose={() => {
            setIsDeleteLinkModalOpen(false);
            setDeletingLink(null);
          }}
          title="Confirmar Exclusão"
        >
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <Trash className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  Tem certeza que deseja excluir este acesso?
                </p>
                <p className="text-sm text-red-600 mt-1">
                  <strong>{deletingLink.name}</strong>
                </p>
                <p className="text-xs text-red-500 mt-2">
                  Esta ação não pode ser desfeita.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteLinkModalOpen(false);
                  setDeletingLink(null);
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteLink}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash className="w-4 h-4" />
                Excluir
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default TaskCreateModal;
