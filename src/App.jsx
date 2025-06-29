import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import RecuperarSenha from './pages/RecuperarSenha';
import Dashboard from './pages/Dashboard';
import Fornecedores from './pages/Fornecedores';
import Historicos from './pages/Historicos';
import Vendas from './pages/Vendas';
import AddProduto from './pages/AddProduto';
import Clients from './pages/Clients';
import Compra from './pages/Compra';
import Header from './components/Header';
import Navegacao from './components/navegacao';
import { useAuth } from './contexts/AuthContext';
// Páginas futuras
// import Fornecedores from './pages/Fornecedores';
// import HistoricoVendas from './pages/HistoricoVendas';
// import Vendas from './pages/Vendas';

// Hook para gerenciar o estado da navegação
function useNavigationState() {
  const [navigationExpanded, setNavigationExpanded] = useState(true);

  useEffect(() => {
    const handleNavigationChange = (event) => {
      setNavigationExpanded(event.detail.expandido);
    };

    document.addEventListener('navigationStateChange', handleNavigationChange);
    return () => {
      document.removeEventListener('navigationStateChange', handleNavigationChange);
    };
  }, []);

  return navigationExpanded;
}

// Componente para páginas que precisam do header
function AuthenticatedLayout({ children }) {
  const { isAuthenticated } = useAuth();
  const navigationExpanded = useNavigationState();
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div className="app-layout">
      <Header />
      <Navegacao />
      <main 
        className="main-content"
        style={{
          marginLeft: navigationExpanded ? '220px' : '70px',
          transition: 'margin-left 0.3s ease'
        }}
      >
        {children}
      </main>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Páginas públicas (sem header) */}
      <Route path="/" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/recuperar-senha" element={<RecuperarSenha />} />
      
      {/* Páginas autenticadas (com header) */}
      <Route path="/dashboard" element={
        <AuthenticatedLayout>
          <Dashboard />
        </AuthenticatedLayout>
      } />
      <Route path="/fornecedores" element={
        <AuthenticatedLayout>
          <Fornecedores />
        </AuthenticatedLayout>
      } />
      <Route path="/historicos" element={
        <AuthenticatedLayout>
          <Historicos />
        </AuthenticatedLayout>
      } />
      <Route path="/vendas" element={
        <AuthenticatedLayout>
          <Vendas />
        </AuthenticatedLayout>
      } />
      <Route path="/add-produto" element={
        <AuthenticatedLayout>
          <AddProduto />
        </AuthenticatedLayout>
      } />
      <Route path="/clients" element={
        <AuthenticatedLayout>
          <Clients />
        </AuthenticatedLayout>
      } />
      <Route path="/compras" element={
        <AuthenticatedLayout>
          <Compra />
        </AuthenticatedLayout>
      } />
      {/* <Route path="/fornecedores" element={<Fornecedores />} /> */}
      {/* <Route path="/historico-vendas" element={<HistoricoVendas />} /> */}
      {/* <Route path="/vendas" element={<Vendas />} /> */}
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
