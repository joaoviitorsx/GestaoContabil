import { X, Building2, Link as LinkIcon, FileText, Lock, Upload, Tag, Briefcase, User, Plus, Eye, EyeOff, Copy, Check, Pen, Trash, ExternalLink, Download} from "lucide-react";
import { useState } from "react";
import type { Task } from "../../../types/workspace/task";
import StatusBadge from "../shared/StatusBadge";
import Input from "../../Input";
import Modal from "../../Modal";
import type { Credential } from "../../../types/workspace";
import type { AccessLink } from "../../../types/workspace";

interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  url?: string;
}

interface TaskViewModalProps {
  task: Task & {
    metadata?: {
      grupo?: string;
      classe?: string;
      statusEmpresa?: string;
      credentials?: Array<{ service: string; username: string; password: string }>;
      accessLinks?: Array<{ label: string; url: string }>;
    };
  };
  grupoNome: string;
  onClose: () => void;
  canEdit?: boolean;
}

export default function TaskViewModal({ task, grupoNome, onClose, canEdit = true }: TaskViewModalProps) {
  const [credentials, setCredentials] = useState<Credential[]>(
    (task.metadata?.credentials || []).map((cred, index) => ({
      id: `cred-${index}`,
      service: cred.service,
      username: cred.username,
      password: cred.password,
      notes: ""
    }))
  );
  const [newCredential, setNewCredential] = useState({ service: "", username: "", password: "", notes: "" });
  const [showCredentialForm, setShowCredentialForm] = useState(false);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const [editingCredential, setEditingCredential] = useState<Credential | null>(null);
  const [deletingCredential, setDeletingCredential] = useState<Credential | null>(null);
  const [accessLinks, setAccessLinks] = useState<AccessLink[]>(
    (task.metadata?.accessLinks || []).map((link, index) => ({
      id: `link-${index}`,
      label: link.label,
      url: link.url,
      description: ""
    }))
  );
  const [newLink, setNewLink] = useState({ label: "", url: "", description: "" });
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [editingLink, setEditingLink] = useState<AccessLink | null>(null);
  const [deletingLink, setDeletingLink] = useState<AccessLink | null>(null);

  // Estados para descrição
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [isSavingDescription, setIsSavingDescription] = useState(false);

  // Estados para anexos
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [editingAttachment, setEditingAttachment] = useState<Attachment | null>(null);
  const [deletingAttachment, setDeletingAttachment] = useState<Attachment | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates({ ...copiedStates, [id]: true });
    setTimeout(() => {
      setCopiedStates({ ...copiedStates, [id]: false });
    }, 2000);
  };

  const togglePassword = (id: string) => {
    setShowPasswords({ ...showPasswords, [id]: !showPasswords[id] });
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

  // Funções para descrição
  const handleSaveDescription = async () => {
    setIsSavingDescription(true);
    // Aqui você pode adicionar a lógica para salvar no backend
    // await updateTaskDescription(task.id, editedDescription);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simula salvamento
    setIsSavingDescription(false);
    setIsEditingDescription(false);
  };

  const handleCancelEditDescription = () => {
    setEditedDescription(task.description);
    setIsEditingDescription(false);
  };

  // Funções para anexos
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('excel') || type.includes('sheet')) return '📊';
    if (type.includes('zip') || type.includes('rar')) return '📦';
    return '📎';
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    
    // Simula upload com delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newAttachments: Attachment[] = Array.from(files).map((file) => ({
      id: `att-${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      url: URL.createObjectURL(file) // Em produção, seria a URL do backend
    }));
    
    setAttachments([...attachments, ...newAttachments]);
  };

  const handleOpenDeleteAttachment = (attachment: Attachment) => {
    setDeletingAttachment(attachment);
  };

  const handleOpenEditAttachment = (attachment: Attachment) => {
    setEditingAttachment({ ...attachment });
  };

  const handleSaveAttachment = () => {
    if (editingAttachment) {
      setAttachments(attachments.map(a => 
        a.id === editingAttachment.id ? editingAttachment : a
      ));
      setEditingAttachment(null);
    }
  };

  const handleDeleteAttachment = () => {
    if (deletingAttachment) {
      setAttachments(attachments.filter(a => a.id !== deletingAttachment.id));
      setDeletingAttachment(null);
    }
  };

  const handleDownloadAttachment = (attachment: Attachment) => {
    // Em produção, faria download do backend
    if (attachment.url) {
      const link = document.createElement('a');
      link.href = attachment.url;
      link.download = attachment.name;
      link.click();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-start justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex-1 pr-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{task.title}</h2>
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <StatusBadge status={task.status} />
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-semibold">Grupo:</span> {grupoNome}</p>
              <p><span className="font-semibold">Empresa:</span> {task.filial}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {task.description && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700 uppercase flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-600" />
                  Descrição
                </h3>
                {canEdit && !isEditingDescription && (
                  <button onClick={() => setIsEditingDescription(true)} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                    title="Editar descrição">
                    <Pen className="w-4 h-4" />
                    Editar
                  </button>
                )}
              </div>

              {isEditingDescription ? (
                <div className="space-y-3">
                  <textarea value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-700 text-sm leading-relaxed"
                    rows={6} placeholder="Descreva a tarefa..." />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveDescription}
                      disabled={isSavingDescription}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSavingDescription ? "Salvando..." : "Salvar"}
                    </button>
                    <button
                      onClick={handleCancelEditDescription}
                      disabled={isSavingDescription}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {editedDescription || task.description}
                  </p>
                </div>
              )}
            </section>
          )}


          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Setor
              </h3>
              <div className="p-3">
                <p className="font-medium text-gray-800 text-sm">{task.setor}</p>
              </div>
            </div>

            {task.metadata?.classe && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Classe
                </h3>
                <div className="p-3">
                  <p className="font-medium text-gray-800 text-sm">Classe {task.metadata.classe}</p>
                </div>
              </div>
            )}

            {task.metadata?.statusEmpresa && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Status
                </h3>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-800 text-sm">{task.metadata.statusEmpresa}</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">Analista Responsável</h3>
              <div className="flex items-center gap-3 p-2 rounded-lg">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">{task.responsible.name}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                Prazo
              </h3>
              <div className="p-3 rounded-lg">
                <p className="text-gray-800 text-sm">{formatDate(task.dueDate)}</p>
              </div>
            </div>
          </div>


          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Credenciais
              </h3>
              {canEdit && (
                <button type="button" onClick={() => setShowCredentialForm(true)} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer">
                  <Plus className="w-4 h-4" />
                  Adicionar
                </button>
              )}
            </div>

            {showCredentialForm && (
              <div className="p-4 bg-gray-50 rounded-lg space-y-3 mb-4 border border-gray-200">
                <Input type="text" placeholder="Nome do Sistema" value={newCredential.service}
                  onChange={(e) => setNewCredential({ ...newCredential, service: e.target.value })}/>
                <Input type="text" placeholder="Usuário" value={newCredential.username}
                  onChange={(e) => setNewCredential({ ...newCredential, username: e.target.value })}/>
                <Input type="password" placeholder="Senha" value={newCredential.password}
                  onChange={(e) => setNewCredential({ ...newCredential, password: e.target.value })}/>
                <textarea placeholder="Observações (opcional)" value={newCredential.notes}
                  onChange={(e) => setNewCredential({ ...newCredential, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  rows={2}/>
                <div className="flex gap-2">
                  <button type="button" onClick={handleAddCredential} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer">
                    Adicionar
                  </button>
                  <button type="button" onClick={() => setShowCredentialForm(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 cursor-pointer">
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {credentials.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {credentials.map((cred) => (
                  <div key={cred.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                        <Lock className="w-5 h-5" />
                      </div>
                      {canEdit && (
                        <div className="flex gap-1">
                          <button onClick={() => handleOpenEditCredential(cred)}  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer" title="Editar">
                            <Pen className="w-4 h-4 text-gray-500" />
                          </button>
                          <button onClick={() => handleOpenDeleteCredential(cred)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" title="Excluir">
                            <Trash className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-gray-800 mb-3">{cred.service}</h3>
                
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs text-gray-500 font-medium">Usuário</p>
                        <button onClick={() => copy(cred.username, `u${cred.id}`)} className="p-1 hover:bg-gray-200 rounded transition-colors cursor-pointer" title="Copiar usuário">
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
                          <button onClick={() => togglePassword(cred.id)} className="p-1 hover:bg-gray-200 rounded transition-colors cursor-pointer" title={showPasswords[cred.id] ? "Ocultar senha" : "Mostrar senha"}>
                            {showPasswords[cred.id] ? (
                              <EyeOff className="w-3 h-3 text-gray-500" />
                            ) : (
                              <Eye className="w-3 h-3 text-gray-500" />
                            )}
                          </button>
                          <button onClick={() => copy(cred.password, `p${cred.id}`)} className="p-1 hover:bg-gray-200 rounded transition-colors cursor-pointer" title="Copiar senha">
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
              <p className="text-sm text-gray-500 italic">Nenhum link adicionado</p>
            )}
          </section>


          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-blue-600" /> Acessos Úteis
              </h3>
              {canEdit && (
                <button type="button" onClick={() => setShowLinkForm(true)} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer">
                  <Plus className="w-4 h-4" />
                  Adicionar
                </button>
              )}
            </div>

            {showLinkForm && (
              <>
                <div className="p-4 bg-blue-50 rounded-lg space-y-3 mb-4 border border-blue-200">
                  <Input type="text" placeholder="Nome do Link" value={newLink.label} onChange={(e) => setNewLink({ ...newLink, label: e.target.value })} maxLength={35}/>
                  <Input type="url" placeholder="URL (https://...)" value={newLink.url} onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}/>
                  <textarea placeholder="Descrição (opcional)" value={newLink.description} onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows={2} />
                  <div className="flex gap-2">
                    <button  type="button" onClick={handleAddLink}  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                      Adicionar
                    </button>
                    <button  type="button"  onClick={() => setShowLinkForm(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 cursor-pointer">
                      Cancelar
                    </button>
                  </div>
                </div>
                <div className="truncate">
                  <h3 className="text-base font-bold text-gray-800 mb-3">{newLink.label}</h3>
                </div>
              </>
            )}

            {accessLinks.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {accessLinks.map((link) => (
                  <div key={link.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <LinkIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      {canEdit && (
                        <div className="flex gap-1">
                          <button onClick={() => handleOpenEditLink(link)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer" title="Editar">
                            <Pen className="w-4 h-4 text-gray-500" />
                          </button>
                          <button onClick={() => handleOpenDeleteLink(link)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" title="Excluir">
                            <Trash className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-base font-bold text-gray-800 mb-3">{link.label}</h3>
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs text-gray-500 font-medium">URL</p>
                        <div className="flex gap-1">
                          <button onClick={() => copy(link.url, `link${link.id}`)} className="p-1 hover:bg-gray-200 rounded transition-colors cursor-pointer" title="Copiar URL">
                            {copiedStates[`link${link.id}`] ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-500" />
                            )}
                          </button>
                          <a href={link.url} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-gray-200 rounded transition-colors cursor-pointer" title="Abrir link">
                            <ExternalLink className="w-4 h-4 text-gray-500" />
                          </a>
                        </div>
                      </div>
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
            ) : (
              <p className="text-sm text-gray-500 italic">Nenhum link adicionado</p>
            )}
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase flex items-center gap-2">
                <Upload className="w-4 h-4 text-green-600" />
                Anexos
              </h3>
              {canEdit && (
                <button type="button" onClick={() => document.getElementById('file-input')?.click()}
                    className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium cursor-pointer">
                  <Plus className="w-4 h-4" />
                  Adicionar
                </button>
              )}
            </div>

            <input id="file-input" type="file" multiple className="hidden" onChange={(e) => handleFileUpload(e.target.files)} />
            {attachments.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {attachments.map((attachment) => (
                  <div key={attachment.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                          {getFileIcon(attachment.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-800 truncate" title={attachment.name}>
                            {attachment.name}
                          </h4>
                          <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>
                        </div>
                      </div>
                      {canEdit && (
                        <div className="flex gap-1 flex-shrink-0 ml-2">
                          <button onClick={() => handleDownloadAttachment(attachment)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer" title="Baixar">
                            <Download className="w-4 h-4 text-gray-500" />
                          </button>
                          <button
                            onClick={() => handleOpenEditAttachment(attachment)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            title="Editar"
                          >
                            <Pen className="w-4 h-4 text-gray-500" />
                          </button>
                          <button onClick={() => handleOpenDeleteAttachment(attachment)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Excluir">
                            <Trash className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-xs text-gray-500">
                        Enviado em{' '}
                        {new Date(attachment.uploadedAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">Nenhum anexo adicionado</p>
            )}
          </section>
        </div>

        <Modal isOpen={!!editingCredential} onClose={() => setEditingCredential(null)} icon={<Pen className="w-5 h-5 text-purple-600" />} 
            title="Editar Credencial" width="max-w-md">
          <div className="space-y-3">
            <Input type="text" placeholder="Nome do Sistema"
              value={editingCredential?.service || ""}
              onChange={(e) => editingCredential && setEditingCredential({ ...editingCredential, service: e.target.value })}
            />
            <Input type="text" placeholder="Usuário" value={editingCredential?.username || ""}
              onChange={(e) => editingCredential && setEditingCredential({ ...editingCredential, username: e.target.value })}
            />
            <Input type="password" placeholder="Senha" value={editingCredential?.password || ""}
              onChange={(e) => editingCredential && setEditingCredential({ ...editingCredential, password: e.target.value })}
            />
            <textarea placeholder="Observações (opcional)" value={editingCredential?.notes || ""}
              onChange={(e) => editingCredential && setEditingCredential({ ...editingCredential, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              rows={2}
            />
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={handleSaveCredential} className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition cursor-pointer">
              Salvar
            </button>
            <button onClick={() => setEditingCredential(null)} className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition cursor-pointer">
              Cancelar
            </button>
          </div>
        </Modal>

        <Modal isOpen={!!deletingCredential} onClose={() => setDeletingCredential(null)}
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
            <button onClick={handleDeleteCredential} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition cursor-pointer">
              Excluir
            </button>
            <button onClick={() => setDeletingCredential(null)} className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition cursor-pointer">
              Cancelar
            </button>
          </div>
        </Modal>

        <Modal isOpen={!!editingLink} onClose={() => setEditingLink(null)} icon={<Pen className="w-5 h-5 text-blue-600" />}
          title="Editar Link" width="max-w-md">
          <div className="space-y-3">
            <Input type="text" placeholder="Nome do Link" value={editingLink?.label || ""} onChange={(e) => editingLink && setEditingLink({ ...editingLink, label: e.target.value })}/>
            <Input type="url" placeholder="URL" value={editingLink?.url || ""} onChange={(e) => editingLink && setEditingLink({ ...editingLink, url: e.target.value })}/>
            <textarea placeholder="Descrição (opcional)" value={editingLink?.description || ""}
              onChange={(e) => editingLink && setEditingLink({ ...editingLink, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={2}/>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={handleSaveLink} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer">
              Salvar
            </button>
            <button onClick={() => setEditingLink(null)} className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition cursor-pointer">
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
          width="max-w-md">
          <p className="text-sm text-gray-500 mb-4">Esta ação não pode ser desfeita</p>
          <p className="text-sm text-gray-600 mb-6">
            Tem certeza que deseja excluir o link <strong>{deletingLink?.label}</strong>?
          </p>
          <div className="flex gap-3">
            <button onClick={handleDeleteLink} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition cursor-pointer">
              Excluir
            </button>
            <button onClick={() => setDeletingLink(null)} className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition cursor-pointer">
              Cancelar
            </button>
          </div>
        </Modal>

        <Modal isOpen={!!editingAttachment} onClose={() => setEditingAttachment(null)} icon={<Pen className="w-5 h-5 text-green-600" />} title="Editar Anexo" width="max-w-md">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Arquivo</label>
              <Input type="text" placeholder="Nome do arquivo" value={editingAttachment?.name || ""}
                onChange={(e) => editingAttachment && setEditingAttachment({ ...editingAttachment, name: e.target.value })}/>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Tamanho</p>
              <p className="text-sm font-medium text-gray-800">
                {editingAttachment ? formatFileSize(editingAttachment.size) : ''}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Tipo</p>
              <p className="text-sm font-medium text-gray-800">
                {editingAttachment?.type || 'Arquivo'}
              </p>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={handleSaveAttachment} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition cursor-pointer">
              Salvar
            </button>
            <button onClick={() => setEditingAttachment(null)} className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition cursor-pointer">
              Cancelar
            </button>
          </div>
        </Modal>

        <Modal
          isOpen={!!deletingAttachment}
          onClose={() => setDeletingAttachment(null)}
          icon={
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Trash className="w-6 h-6 text-red-600" />
            </div>
          }
          title="Excluir Anexo"
          width="max-w-md"
        >
          <p className="text-sm text-gray-500 mb-4">Esta ação não pode ser desfeita</p>
          <p className="text-sm text-gray-600 mb-6">
            Tem certeza que deseja excluir o arquivo <strong>{deletingAttachment?.name}</strong>?
          </p>
          <div className="flex gap-3">
            <button onClick={handleDeleteAttachment} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition cursor-pointer">
              Excluir
            </button>
            <button onClick={() => setDeletingAttachment(null)} className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition cursor-pointer">
              Cancelar
            </button>
          </div>
        </Modal>

        <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
