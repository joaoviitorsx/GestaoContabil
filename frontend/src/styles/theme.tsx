export const colors = {
  primary: "#C2185B",        // Cor principal — botões, ícones, links
  primaryDark: "#A0134B",    // Hover / ativo

  // ⚙️ Tons neutros
  secondary: "#3A4049",      // Texto principal / títulos
  background: "#FAFBFC",     // Fundo geral da aplicação
  surface: "#FFFFFF",        // Cards, painéis, modais
  border: "#ECEFF1",         // Bordas e divisões sutis
  textMuted: "#6B7280",      // Texto secundário / placeholder

  // ✅ Feedback
  success: "#4CAF50",        // Sucesso
  error: "#E53935",          // Erro
  warning: "#FFC107",        // Alerta
  info: "#2196F3",           // Informação
} as const;

export type ColorKeys = keyof typeof colors;
