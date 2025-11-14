import {X, User, Calendar, Clock, CheckCircle2, Play, AlertCircle, KeyRound, Eye, EyeOff, Copy, Check, ExternalLink, Paperclip, Download, Edit, Upload, Trash, Pen } from "lucide-react";
import { useState } from "react";
import type { Workspace, Task, Credential, AccessLink } from "../../types/workspace";
import Modal from "../Modal";

interface TaskViewModalProps {
  task: Task;
  workspace: Workspace;
  onClose: () => void;
  isAdmin?: boolean; 
  onUpdateTask?: (updatedTask: Task) => void;
}

export default function TaskViewModal({ task, workspace, onClose, isAdmin = true, onUpdateTask }: TaskViewModalProps) {
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [isSavingDescription, setIsSavingDescription] = useState(false);
  const [isUploadingFile] = useState(false);
  const [localAttachments, setLocalAttachments] = useState(
    workspace.documents.filter((d) => task.attachmentIds?.includes(d.id))
  );

  //credenciais
  const [isEditCredentialModalOpen, setIsEditCredentialModalOpen] = useState(false);
  const [isDeleteCredentialModalOpen, setIsDeleteCredentialModalOpen] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null);
  const [credentialFormData, setCredentialFormData] = useState({
    system: "",
    url: "",
    username: "",
    password: "",
    notes: ""
  });

  //links de acesso
  const [isEditLinkModalOpen, setIsEditLinkModalOpen] = useState(false);
  const [isDeleteLinkModalOpen, setIsDeleteLinkModalOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<AccessLink | null>(null);
  const [linkFormData, setLinkFormData] = useState({
    name: "",
    url: "",
    description: ""
  });

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates({ [id]: true });
    setTimeout(() => setCopiedStates({ [id]: false }), 2000);
  };

  const togglePassword = (id: string) =>
    setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }));

  const taskLinks = workspace.accessLinks.filter((l) =>
    task.accessLinkIds?.includes(l.id)
  );

  const handleSaveDescription = async () => {
    setIsSavingDescription(true);
    
    try {
      const updatedTask = {
        ...task,
        description: editedDescription,
        updatedAt: new Date().toISOString().split("T")[0]
      };

      if (onUpdateTask) {
        onUpdateTask(updatedTask);
      }

      setIsEditingDescription(false);
    } catch (error) {
      console.error("Erro ao salvar descrição:", error);
      alert("Erro ao salvar descrição. Tente novamente.");
    } finally {
      setIsSavingDescription(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedDescription(task.description);
    setIsEditingDescription(false);
  };

  const handleExcluirAnexo = (docId: string) => {
    const updatedAttachments = localAttachments.filter(doc => doc.id !== docId);
    setLocalAttachments(updatedAttachments);

    if (onUpdateTask) {
      const updatedTask = {
        ...task,
        attachmentIds: (task.attachmentIds || []).filter(id => id !== docId),
        attachments: Math.max((task.attachments || 1) - 1, 0),
      };
      onUpdateTask(updatedTask);
    }
  };

  const handleOpenEditCredential = (cred: Credential) => {
    setSelectedCredential(cred);
    setCredentialFormData({
      system: cred.system,
      url: cred.url || "",
      username: cred.username,
      password: cred.password,
      notes: cred.notes || ""
    });
    setIsEditCredentialModalOpen(true);
  };

  const handleOpenDeleteCredential = (cred: Credential) => {
    setSelectedCredential(cred);
    setIsDeleteCredentialModalOpen(true);
  };

  const handleSaveCredential = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log("Credencial atualizada:", credentialFormData);
      setIsEditCredentialModalOpen(false);
      setSelectedCredential(null);
    } catch (error) {
      console.error("Erro ao salvar credencial:", error);
    }
  };

  const handleDeleteCredential = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log("Credencial excluída:", selectedCredential?.id);
      setIsDeleteCredentialModalOpen(false);
      setSelectedCredential(null);
    } catch (error) {
      console.error("Erro ao excluir credencial:", error);
    }
  };

  const handleOpenEditLink = (link: AccessLink) => {
    setSelectedLink(link);
    setLinkFormData({
      name: link.name,
      url: link.url,
      description: link.description || ""
    });
    setIsEditLinkModalOpen(true);
  };

  const handleOpenDeleteLink = (link: AccessLink) => {
    setSelectedLink(link);
    setIsDeleteLinkModalOpen(true);
  };

  const handleSaveLink = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log("Link atualizado:", linkFormData);
      setIsEditLinkModalOpen(false);
      setSelectedLink(null);
    } catch (error) {
      console.error("Erro ao salvar link:", error);
    }
  };

  const handleDeleteLink = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log("Link excluído:", selectedLink?.id);
      setIsDeleteLinkModalOpen(false);
      setSelectedLink(null);
    } catch (error) {
      console.error("Erro ao excluir link:", error);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newAttachments = Array.from(files).map((file) => ({
      id: `d${Date.now()}-${Math.random()}`,
      name: file.name,
      type: file.type || "application/octet-stream",
      size: `${(file.size / 1024).toFixed(2)} KB`,
      url: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString().split("T")[0],
      uploadedBy: task.responsible.name,
    }));

    setLocalAttachments((prev) => [...prev, ...newAttachments]);

    const updatedTask = {
      ...task,
      attachmentIds: [...(task.attachmentIds || []), ...newAttachments.map((doc) => doc.id)],
      attachments: (task.attachments || 0) + newAttachments.length,
    };

    if (onUpdateTask) {
      onUpdateTask(updatedTask);
    }

    event.target.value = "";
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">{task.title}</h2>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                {task.status === 'done' && (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="font-medium text-green-700">Concluída</span>
                  </>
                )}
                {task.status === "in-progress" && (
                  <>
                    <Play className="w-4 h-4 text-blue-500" />
                    <span className="font-medium text-blue-700">Em andamento</span>
                  </>
                )}
                {task.status === "in-review" && (
                  <>
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium text-yellow-700">Em revisão</span>
                  </>
                )}
                {task.status === "backlog" && (
                  <>
                    <Clock className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium text-yellow-700">A Fazer</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <span>{task.responsible.name}</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span>
                  Prazo: {new Date(task.dueDate).toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>
          </div>

          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition cursor-pointer">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-black-700 uppercase mb-3">
                Status:
              </h2>
            </div>
          </section>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-black-700 uppercase">
                Descrição
              </h3>
              {isAdmin && !isEditingDescription && (
                <button onClick={() => setIsEditingDescription(true)} className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer">
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
              )}
            </div>

            {isEditingDescription ? (
              <div className="space-y-3">
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="w-full min-h-[150px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                  placeholder="Digite a descrição da tarefa..."
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveDescription}
                    disabled={isSavingDescription}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                    {isSavingDescription ? "Salvando..." : "Salvar"}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={isSavingDescription}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700 whitespace-pre-line">
                {task.description || "Sem descrição adicionada."}
              </p>
            )}
          </section>

          {workspace.credentials.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-purple-600" /> Credenciais
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {workspace.credentials.map((cred) => (
                  <div key={cred.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                        <KeyRound className="w-5 h-5 text-purple-600" />
                      </div>
                      {isAdmin && (
                        <div className="flex gap-1">
                          <button onClick={() => handleOpenEditCredential(cred)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer" title="Editar">
                            <Pen className="w-4 h-4 text-gray-500" />
                          </button>
                          <button onClick={() => handleOpenDeleteCredential(cred)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" title="Excluir">
                            <Trash className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-gray-7600 mb-1">{cred.system}</h3>
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs text-gray-500 font-medium">Usuário</p>
                        <button
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
            </section>
          )}

          {taskLinks.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-blue-600" /> Acessos Úteis
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {taskLinks.map((link) => (
                  <div key={link.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <ExternalLink className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => copy(link.url, `link-${link.id}`)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                          title="Copiar URL">
                          {copiedStates[`link-${link.id}`] ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                        {isAdmin && (
                          <>
                            <button
                              onClick={() => handleOpenEditLink(link)}
                              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                              title="Editar">
                              <Pen className="w-4 h-4 text-gray-500" />
                            </button>
                            <button
                              onClick={() => handleOpenDeleteLink(link)}
                              className="p-1.5 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Excluir"
                            >
                              <Trash className="w-4 h-4 text-red-500" />
                            </button>
                          </>
                        )}
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
            </section>
          )}

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
                <div key={doc.id} className="group bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-green-200 transition-all duration-200">
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

                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => window.open(doc.url, "_blank")}
                        className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition flex-shrink-0"
                        title="Baixar"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => { handleExcluirAnexo(doc.id); }}
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

        <div className="p-4 border-t border-gray-200 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-500 transition cursor-pointer">
            Fechar
          </button>
        </div>
      </div>

      <Modal
        isOpen={isEditCredentialModalOpen}
        onClose={() => {
          setIsEditCredentialModalOpen(false);
          setSelectedCredential(null);
        }}
        icon={<KeyRound className="w-5 h-5 text-purple-600" />}
        title="Editar Credencial"
        width="max-w-lg"
        footer={
          <>
            <button
              onClick={() => {
                setIsEditCredentialModalOpen(false);
                setSelectedCredential(null);
              }}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button
              onClick={handleSaveCredential}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Atualizar
            </button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Sistema
            </label>
            <input
              type="text"
              value={credentialFormData.system}
              onChange={(e) => setCredentialFormData({ ...credentialFormData, system: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Domínio Web"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL (opcional)
            </label>
            <input
              type="url"
              value={credentialFormData.url}
              onChange={(e) => setCredentialFormData({ ...credentialFormData, url: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuário</label>
            <input
              type="text"
              value={credentialFormData.username}
              onChange={(e) => setCredentialFormData({ ...credentialFormData, username: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="usuário@exemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              value={credentialFormData.password}
              onChange={(e) => setCredentialFormData({ ...credentialFormData, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações (opcional)
            </label>
            <textarea
              value={credentialFormData.notes}
              onChange={(e) => setCredentialFormData({ ...credentialFormData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              placeholder="Informações adicionais..."
            />
          </div>
        </form>
      </Modal>

      {/* Modal Confirmar Exclusão de Credencial */}
      <Modal
        isOpen={isDeleteCredentialModalOpen}
        onClose={() => {
          setIsDeleteCredentialModalOpen(false);
          setSelectedCredential(null);
        }}
        icon={<Trash className="w-5 h-5 text-red-600" />}
        title="Excluir Credencial"
        width="max-w-md"
        footer={
          <>
            <button
              onClick={() => { setIsDeleteCredentialModalOpen(false); setSelectedCredential(null);}}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button onClick={handleDeleteCredential} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Excluir
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Tem certeza que deseja excluir a credencial <strong>{selectedCredential?.system}</strong>?
          </p>
        </div>
      </Modal>

      <Modal
        isOpen={isEditLinkModalOpen}
        onClose={() => {
          setIsEditLinkModalOpen(false);
          setSelectedLink(null);
        }}
        icon={<ExternalLink className="w-5 h-5 text-blue-600" />}
        title="Editar Acesso"
        width="max-w-lg"
        footer={
          <>
            <button
              onClick={() => {
                setIsEditLinkModalOpen(false);
                setSelectedLink(null);
              }}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveLink}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Atualizar
            </button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Acesso
            </label>
            <input
              type="text"
              value={linkFormData.name}
              onChange={(e) => setLinkFormData({ ...linkFormData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Portal e-CAC"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
            <input
              type="url"
              value={linkFormData.url}
              onChange={(e) => setLinkFormData({ ...linkFormData, url: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição (opcional)
            </label>
            <textarea
              value={linkFormData.description}
              onChange={(e) => setLinkFormData({ ...linkFormData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              placeholder="Breve descrição do acesso..."
            />
          </div>
        </form>
      </Modal>

      {/* Modal Confirmar Exclusão de Link */}
      <Modal
        isOpen={isDeleteLinkModalOpen}
        onClose={() => {
          setIsDeleteLinkModalOpen(false);
          setSelectedLink(null);
        }}
        icon={<Trash className="w-5 h-5 text-red-600" />}
        title="Excluir Acesso"
        width="max-w-md"
        footer={
          <>
            <button
              onClick={() => {
                setIsDeleteLinkModalOpen(false);
                setSelectedLink(null);
              }}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleDeleteLink}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Excluir
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Tem certeza que deseja excluir o acesso <strong>{selectedLink?.name}</strong>?
          </p>
        </div>
      </Modal>
    </div>
  );
}