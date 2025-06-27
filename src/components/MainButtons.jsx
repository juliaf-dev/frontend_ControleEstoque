import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MainButtons.css';

export default function MainButtons() {
  const navigate = useNavigate();
  return (
    <div className="main-buttons">
      <button onClick={() => navigate('/fornecedores')}>
        <span>Fornecedores</span>
      </button>
      <button onClick={() => navigate('/historico-vendas')}>
        <span>Histórico de Vendas</span>
      </button>
      <button onClick={() => navigate('/caixa')}>
        <span>Caixa</span>
      </button>
      <button onClick={() => navigate('/compras')}>
        <span>Compras</span>
      </button>
      <button onClick={() => navigate('/clientes')}>
        <span>Clientes</span>
      </button>
    </div>
  );
} 