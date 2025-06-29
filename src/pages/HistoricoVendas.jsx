import React, { useState, useEffect } from 'react';
import Voltar from '../components/Voltar';
import './HistoricoVendas.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faCalendarAlt, faUser, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

export default function HistoricoVendas() {
  const [vendas, setVendas] = useState([]);
  const [expandido, setExpandido] = useState(null);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    // Simular dados de vendas - em produção, isso viria do backend
    const vendasMock = [
      {
        id: 1,
        cliente: 'João Silva',
        data: '15/01/2024',
        hora: '14:30',
        valor: 150.00,
        produtos: ['Produto A - R$ 75,00', 'Produto B - R$ 75,00'],
        formaPagamento: 'Cartão de Crédito',
        numeroPedido: '#VDA001'
      },
      {
        id: 2,
        cliente: 'Maria Santos',
        data: '14/01/2024',
        hora: '09:15',
        valor: 89.50,
        produtos: ['Produto C - R$ 89,50'],
        formaPagamento: 'PIX',
        numeroPedido: '#VDA002'
      },
      {
        id: 3,
        cliente: 'Pedro Costa',
        data: '13/01/2024',
        hora: '16:45',
        valor: 200.00,
        produtos: ['Produto D - R$ 100,00', 'Produto E - R$ 50,00', 'Produto F - R$ 50,00'],
        formaPagamento: 'Dinheiro',
        numeroPedido: '#VDA003'
      }
    ];
    setVendas(vendasMock);
  }, []);

  const handleExpandir = (id) => {
    setExpandido(expandido === id ? null : id);
  };

  // Filtro
  const vendasFiltradas = vendas.filter(v => {
    const clienteMatch = v.cliente.toLowerCase().includes(busca.toLowerCase());
    return clienteMatch;
  });

  return (
    <div className="historico-vendas-page">
      <Voltar />
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
                  <FontAwesomeIcon icon={faCalendarAlt} /> {venda.data} às {venda.hora}
                </span>
              </div>
              <div className="venda-header-principal">
                <div className="venda-info-cliente">
                  <span className="venda-cliente">{venda.cliente}</span>
                </div>
                <span className="venda-valor">R$ {venda.valor.toFixed(2)}</span>
                <span className="venda-expand-icon">
                  <FontAwesomeIcon icon={expandido === venda.id ? faChevronUp : faChevronDown} />
                </span>
              </div>
            </div>
            {expandido === venda.id && (
              <div className="venda-detalhes">
                <div>
                  <b><FontAwesomeIcon icon={faCalendarAlt} /> Data/Hora:</b>
                  <span>{venda.data} às {venda.hora}</span>
                </div>
                <div>
                  <b><FontAwesomeIcon icon={faUser} /> Cliente:</b>
                  <span>{venda.cliente}</span>
                </div>
                <div>
                  <b>Nº Pedido:</b>
                  <span>{venda.numeroPedido}</span>
                </div>
                <div>
                  <b>Valor Total:</b>
                  <span style={{ fontWeight: 'bold', color: '#4CAF50' }}>R$ {venda.valor.toFixed(2)}</span>
                </div>
                <div>
                  <b>Forma Pagamento:</b>
                  <span>{venda.formaPagamento}</span>
                </div>
                <div style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <b><FontAwesomeIcon icon={faShoppingCart} /> Produtos:</b>
                  <ul className="venda-produtos">
                    {venda.produtos.map((produto, index) => (
                      <li key={index}>{produto}</li>
                    ))}
                  </ul>
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