import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/auth';
import CustomChild from './customChild';
import Dashboard from '../pages/dashboard/index';
import FornecedoresPage from '../pages/fornecedor/index';
import NotFoundPage from '../pages/notFound';
import adminPage from '../pages/admin';
import EmpresasPage from '../pages/empresas';
import GruposPage from '../pages/tarefas';
import EmpresasViewPage from '../pages/tarefas/empresas';
import KanbanPage from '../pages/tarefas/kanban';

function AppRoutes() {
  return (
    <Routes>
        <Route path="/" element={<CustomChild Child={LoginPage}/>} />
        <Route path="/dashboard" element={<CustomChild Child={Dashboard}/>} />
        <Route path="/fornecedores" element={<CustomChild Child={FornecedoresPage}/>}/>
        <Route path="/administracao" element={<CustomChild Child={adminPage}/>}></Route>
        <Route path="/empresas" element={<CustomChild Child={EmpresasPage}/>}></Route>
        
        <Route path="/tarefas" element={<CustomChild Child={GruposPage}/>}></Route>
        <Route path="/tarefas/empresas/:grupoId" element={<CustomChild Child={EmpresasViewPage}/>}></Route>
        <Route path="/tarefas/painel/:grupoId/:empresaId" element={<CustomChild Child={KanbanPage}/>}></Route>
        
        <Route path="*" element={<CustomChild Child={NotFoundPage}/>} />
    </Routes>
  );
}

export default AppRoutes