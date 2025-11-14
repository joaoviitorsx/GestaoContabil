export interface Fornecedor {
    cnpj: string;
    razaoSocial: string;
    situacao: string;
    cnae: string;
    municipio: string;
    uf: string;
    regime: string;
}

export interface CardFornecedorProps {
    fornecedor: Fornecedor;
}