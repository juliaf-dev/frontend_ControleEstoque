import React from 'react';
import MainButtons from '../components/MainButtons';
import ProdutosSection from '../components/ProdutosSection';
import './Dashboard.css';

export default function Dashboard() {
  return (
    <div className="dashboard-container">
        <div className="alerta-estoque-baixo">
        Atenção: Existem produtos com estoque baixo! Reponha o estoque o quanto antes.
      </div>
        <MainButtons />
        <ProdutosSection />
    </div>
  );
} 