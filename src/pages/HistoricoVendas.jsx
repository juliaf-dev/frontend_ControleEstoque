import React, { useState, useEffect } from 'react';
import Voltar from '../components/Voltar';
import './HistoricoVendas.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faCalendarAlt, faUser, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { pedidoService } from '../services/pedidoService';

export default function HistoricoVendas() {
  const [vendas, setVendas] = useState([]);
  const [expandido, setExpandido] = useState(null);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarVendas();
  }, []);

  const carregarVendas = async () => {
    try {
      setLoading(true);
      const response = await pedidoService.getPedidos();
      const vendasData = response.data || [];
      // Filtrar apenas vendas (tipo: 'venda')
      const vendasFiltradas = vendasData.filter(pedido => pedido.tipo === 'venda');
      setVendas(vendasFiltradas);
    } catch (error) {
      setErro('Erro ao carregar histórico de vendas');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExpandir = (id) => {
    setExpandido(expandido === id ? null : id);
  };

  // Filtro
  const vendasFiltradas = vendas.filter(v => {
    const clienteMatch = v.cliente?.nome?.toLowerCase().includes(busca.toLowerCase()) || 
                        v.cliente?.toLowerCase().includes(busca.toLowerCase());
    return clienteMatch;
  });

  if (loading) {
    return (
      <div className="historico-vendas-page">
        <Voltar showHome={true} title="Voltar" />
        <h1>Histórico de Vendas</h1>
        <div className="loading">Carregando vendas...</div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="historico-vendas-page">
        <Voltar showHome={true} title="Voltar" />
        <h1>Histórico de Vendas</h1>
        <div className="erro">{erro}</div>
      </div>
    );
  }

  return (
    <div className="historico-vendas-page">
      <Voltar showHome={true} title="Voltar" />
      <h1>Histórico de Vendas</h1>
      <div className="filtros-vendas">
        <input
          type="text"
          placeholder="Buscar por cliente..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
        />
      </div>
      <ul className="historico-vendas-lista">
        {vendasFiltradas.map(venda => (
          <li key={venda.id} className={`venda-item ${expandido === venda.id ? 'expandido' : ''}`}>
            <div className="venda-cabecalho" onClick={() => handleExpandir(venda.id)}>
              <div className="venda-header-topo">
                <span className="venda-data">
                  <FontAwesomeIcon icon={faCalendarAlt} /> {new Date(venda.createdAt).toLocaleDateString('pt-BR')} às {new Date(venda.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="venda-header-principal">
                <div className="venda-info-cliente">
                  <span className="venda-cliente">{venda.cliente?.nome || venda.cliente || 'Cliente não informado'}</span>
                </div>
                <span className="venda-valor">R$ {parseFloat(venda.valor).toFixed(2)}</span>
                <span className="venda-expand-icon">
                  <FontAwesomeIcon icon={expandido === venda.id ? faChevronUp : faChevronDown} />
                </span>
              </div>
            </div>
            {expandido === venda.id && (
              <div className="venda-detalhes">
                <div>
                  <b><FontAwesomeIcon icon={faCalendarAlt} /> Data/Hora:</b>
                  <span>{new Date(venda.createdAt).toLocaleDateString('pt-BR')} às {new Date(venda.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div>
                  <b><FontAwesomeIcon icon={faUser} /> Cliente:</b>
                  <span>{venda.cliente?.nome || venda.cliente || 'Cliente não informado'}</span>
                </div>
                <div>
                  <b>Nº Pedido:</b>
                  <span>{venda.codigo || `#${venda.id}`}</span>
                </div>
                <div>
                  <b>Valor Total:</b>
                  <span style={{ fontWeight: 'bold', color: '#4CAF50' }}>R$ {parseFloat(venda.valor).toFixed(2)}</span>
                </div>
                <div>
                  <b>Produto:</b>
                  <span>{venda.nome}</span>
                </div>
                <div>
                  <b>Quantidade:</b>
                  <span>{venda.quantidade || 1}</span>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      {vendasFiltradas.length === 0 && (
        <div className="sem-vendas">Nenhuma venda encontrada.</div>
      )}
    </div>
  );
} 