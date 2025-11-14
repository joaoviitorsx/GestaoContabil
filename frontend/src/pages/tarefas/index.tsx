import { Card } from "antd";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import MainLayout from "../../layouts/MainLayout";
import { modulos } from "../../mock/modulos";

function ModulosPage() {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            Módulos de Automação
          </h1>
          <p className="text-gray-500 text-base">
            Selecione um módulo para começar
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {modulos.map((modulo) => {
            const Icon = modulo.icon;
            return (
              <Card key={modulo.title} role="button" tabIndex={0} aria-label={`Abrir módulo ${modulo.title}`}
                className={` group flex flex-col justify-between h-full min-h-[260px] border border-gray-100 shadow-sm bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer rounded-xl p-6
                  focus:ring-2 focus:ring-blue-400 focus:outline-none`}
                onClick={() => navigate(modulo.path)}>
                <div className="flex flex-col flex-1">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="text-blue-600" size={24} />
                  </div>

                  <h2 className="text-xl font-semibold text-gray-800 mb-2 tracking-tight group-hover:text-blue-700 transition-colors">
                    {modulo.title}
                  </h2>

                  <p className="text-gray-500 leading-relaxed line-clamp-1 mb-6">
                    {modulo.description}
                  </p>
                </div>

                <div className="mt-auto">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg 
                    transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow-md cursor-pointer group">
                        Acessar módulo
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1"/>
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}

export default ModulosPage;
