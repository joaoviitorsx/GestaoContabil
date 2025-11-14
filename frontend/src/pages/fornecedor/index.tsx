import { Card, Input, Tooltip } from "antd";
import MainLayout from "../../layouts/MainLayout";
import Label from "../../components/Label";
import { FileSpreadsheet, Search } from "lucide-react";
import { MockFornecedor } from "../../mock/for";
import { useState } from "react";
import CardFornecedor from "../../components/cardFornecedor";

function FornecedorPage() {
    const [showCard, setShowCard] = useState(false);
    const handleSearch = () => {
        setShowCard(true);
    };

    return (
        <MainLayout>
            <div className="max-w-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Consulta de Fornecedor</h1>
                    <p className="text-gray-500 text-base mt-2">Consulte os dados fiscais utilizando o CNPJ do fornecedor</p>
                </header>

                <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold text-gray-800 mb-1">Consulta por CNPJ</h2>
                            <p className="text-gray-500 text-sm">Digite o CNPJ ou importe uma planilha com múltiplos CNPJs</p>
                        </div>
                        
                        <Tooltip title="Importar planilha com múltiplos CNPJs">
                            <button className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg shadow-sm hover:bg-blue-700 transition-colors duration-200 font-medium text-sm cursor-pointer">
                                <FileSpreadsheet size={18} />
                                Importar Planilha
                            </button>
                        </Tooltip>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="CNPJ" className="font-medium text-gray-700 mb-1.5 block">
                                CNPJ do Fornecedor
                            </Label>
                            <div className="flex items-center gap-3">
                                <div className="flex-1">
                                    <Input
                                        id="CNPJ"
                                        size="large"
                                        placeholder="Digite o CNPJ do fornecedor"
                                        prefix={<Search className="text-gray-400 mr-2" size={18} />}
                                        className="rounded-lg"
                                    />
                                </div>
                                <button className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-lg shadow-sm hover:bg-green-700 transition-colors duration-200 font-medium text-sm h-[40px] cursor-pointer"
                                onClick={handleSearch}>
                                    <Search size={18} />
                                    Pesquisar
                                </button>
                            </div>
                        </div>
                    </div>
                </Card>
                {showCard && (
                    <div className="mt-6">
                        <CardFornecedor fornecedor={MockFornecedor}/>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}

export default FornecedorPage;