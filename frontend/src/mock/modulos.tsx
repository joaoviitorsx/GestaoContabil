import { FileText, ScrollText, FileChartLine, ScanText, BadgeDollarSign } from "lucide-react";

export const modulos = [
    {
      title: "Extrator NF-e",
      description: "Extração de dados de notas fiscais eletrônicas (NF-e).",
      path: "/modulos/extrator-xml",
      icon: ScrollText,
    },
    {
      title: "Extrator CF-e",
      description: "Extração de dados de cupons fiscais eletrônicos (CF-e).",
      path: "/modulos/extrator-cfe",
      icon: FileText,
    },
    {
      title: "Extrator SPED/COFINS",
      description: "Extração de dados de arquivos SPED.",
      path: "/modulos/extrator-sped-cofins",
      icon: FileChartLine,
    },
    {
      title: "Apurador ICMS",
      description: "Apuração de ICMS a partir de Sped Fiscal.",
      path: "/modulos/apurador-icms",
      icon: BadgeDollarSign,
    },
    {
      title: "Exportação Fortes Fiscal",
      description:"Converte Sped Fiscal para o formato Fortes Fiscal.",
      path: "/modulos/fortes-fiscal",
      icon: ScanText,
    },
  ];