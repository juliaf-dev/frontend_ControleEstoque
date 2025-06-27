import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import RecuperarSenha from './pages/RecuperarSenha';
import Dashboard from './pages/Dashboard';
import Fornecedores from './pages/Fornecedores';
import HistoricoVendas from './pages/HistoricoVendas';
import Caixa from './pages/Caixa';
import AddProduto from './pages/AddProduto';
import Compra from './pages/Compra';
import Clients from './pages/Clients';
// Páginas futuras
// import Fornecedores from './pages/Fornecedores';
// import HistoricoVendas from './pages/HistoricoVendas';
// import Caixa from './pages/Caixa';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/fornecedores" element={<Fornecedores />} />
          <Route path="/historico-vendas" element={<HistoricoVendas />} />
          <Route path="/caixa" element={<Caixa />} />
          <Route path="/add-produto" element={<AddProduto />} />
          <Route path="/compras" element={<Compra />} />
          <Route path="/clientes" element={<Clients />} />
          {/* <Route path="/fornecedores" element={<Fornecedores />} /> */}
          {/* <Route path="/historico-vendas" element={<HistoricoVendas />} /> */}
          {/* <Route path="/caixa" element={<Caixa />} /> */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
