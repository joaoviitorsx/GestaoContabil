export const mockUser = {
  name: "Administrador",
  email: "admin@assertivus.com",
  avatar: (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="rounded-full bg-gray-200"
    >
      <circle cx="16" cy="16" r="16" fill="#ADADAD" />
      <circle cx="16" cy="13" r="6" fill="#fff" />
      <ellipse cx="16" cy="25" rx="9" ry="5" fill="#fff" />
    </svg>
  ),
};

export const usuarios = [
  {
    id: 1,
    nome: "Pessoa 1",
    email: "pessoa1@assertivus.com",
    cargo: "Estagiario",
    status: "Ativo",
    ultimoAcesso: "2024-06-10 14:23",
  },
  {
    id: 2,
    nome: "Pessoa 2",
    email: "pessoa2@assertivus.com",
    cargo: "Estagiario",
    status: "Ativo",
    ultimoAcesso: "2024-06-10 14:23",
  },
  {
    id: 3,
    nome: "Pessoa 3",
    email: "pessoa3@assertivus.com",
    cargo: "Estagiario",
    status: "Ativo",
    ultimoAcesso: "2024-06-10 14:23",
  },
  {
    id: 4,
    nome: "Pessoa 4",
    email: "pessoa4@assertivus.com",
    cargo: "Estagiario",
    status: "Ativo",
    ultimoAcesso: "2024-06-10 14:23",
  },
];

export const modulos = [
  {
    nome: "Dashboard",
    admin: true,
    contador: true,
    analista: true,
  },
  { 
    nome: "Automatizações", 
    admin: true, 
    contador: true, 
    analista: false 
  },
  { 
    nome: "Fornecedores", 
    admin: true, 
    contador: true, 
    analista: true 
  },
  { 
    nome: "Empresas", 
    admin: true, 
    contador: true, 
    analista: true 
  },
  { 
    nome: "Painel Administrativo", 
    admin: true, 
    contador: true, 
    analista: true 
  },
];
