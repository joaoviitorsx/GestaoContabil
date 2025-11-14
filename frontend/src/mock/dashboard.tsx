import { Building2, ScrollText, Settings, FolderUp } from 'lucide-react';

export const docsMensais = [
  { mes: "Mai", nfe: 520, cfe: 740, sped: 18 },
  { mes: "Jun", nfe: 610, cfe: 820, sped: 21 },
  { mes: "Jul", nfe: 580, cfe: 860, sped: 19 },
  { mes: "Ago", nfe: 690, cfe: 910, sped: 23 },
  { mes: "Set", nfe: 720, cfe: 950, sped: 22 },
  { mes: "Out", nfe: 705, cfe: 970, sped: 24 },
];

export const atividades = [
  { id: 1, icon: <ScrollText />, texto: "SPED Setembro/2025 processado para Atacado do Vale", horario: "Hoje 10:32" },
  { id: 2, icon: <Building2 />, texto: "Empresa cadastrada: Comercial JM", horario: "Ontem 14:10" },
  { id: 3, icon: <Settings />, texto: "Apuração ICMS concluída para Super Norte", horario: "Ontem 09:02" },
  { id: 4, icon: <FolderUp />, texto: "Exportação Fortes Fiscal (.fs) gerada para Empresa XYZ", horario: "2 dias atrás" },
];

export const alertas = [
  { id: 1, tipo: "warn", titulo: "Produtos sem alíquota", detalhe: "27 itens pendentes para Empresa XYZ", acao: "Abrir pendências" },
  { id: 2, tipo: "err", titulo: "Falha em processamento", detalhe: "SPED 2025-10 para Empresa XYZ", acao: "Ver logs" },
  { id: 3, tipo: "warn", titulo: "SPED do mês ausente", detalhe: "Empresa XYZ — Outubro/2025", acao: "Importar SPED" },
];