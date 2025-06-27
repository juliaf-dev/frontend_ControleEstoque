import React from 'react';
import Header from '../components/Header';
import MainButtons from '../components/MainButtons';
import ProdutosSection from '../components/ProdutosSection';
import './Dashboard.css';

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <Header />
      <main>
        <div className="alerta-estoque-baixo">
        Atenção: Existem produtos com estoque baixo! Reponha o estoque o quanto antes.
      </div>
        <MainButtons />
        <ProdutosSection />
      </main>
    </div>
  );
} 