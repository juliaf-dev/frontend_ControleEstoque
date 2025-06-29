import React, { useState, useEffect } from 'react';
import Voltar from '../components/Voltar';
import './Compra.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faCalendarAlt, faBox, faTruck, faDollarSign, faBuilding, faPhone, faClock, faCheck, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

function Compra() {
  const [pedidos, setPedidos] = useState([]);
  const [expandido, setExpandido] = useState(null);
  const [busca, setBusca] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('todos');

  useEffect(() => {
    const pedidosSalvos = JSON.parse(localStorage.getItem('compras_pedidos') || '[]');
    // Adicionar status padrão se não existir
    const pedidosComStatus = pedidosSalvos.map(pedido => ({
      ...pedido,
      status: pedido.status || 'a-caminho',
      dataRecebimento: pedido.dataRecebimento || calcularDataRecebimento(pedido.tempoEntrega)
    }));
    setPedidos(pedidosComStatus.reverse());
  }, []);

  const calcularDataRecebimento = (tempoEntrega) => {
    const hoje = new Date();
    const dias = parseInt(tempoEntrega) || 7;
    const dataRecebimento = new Date(hoje.getTime() + (dias * 24 * 60 * 60 * 1000));
    return dataRecebimento.toLocaleDateString('pt-BR');
  };

  const verificarStatusAtrasado = (dataRecebimento, status) => {
    if (status === 'recebido') return status;
    
    const dataRecebimentoObj = new Date(dataRecebimento.split('/').reverse().join('-'));
    const hoje = new Date();
    
    if (dataRecebimentoObj < hoje) {
      return 'atrasado';
    }
    return status;
  };

  const handleExpandir = (id) => {
    setExpandido(expandido === id ? null : id);
  };

  const handleMarcarConcluido = (id) => {
    const pedidosAtualizados = pedidos.map((pedido, idx) => 
      idx === id ? { ...pedido, status: 'recebido' } : pedido
    );
    setPedidos(pedidosAtualizados);
    
    // Salvar no localStorage
    const pedidosParaSalvar = JSON.parse(localStorage.getItem('compras_pedidos') || '[]');
    const pedidoAtualizado = pedidosParaSalvar.find((_, idx) => idx === (pedidosParaSalvar.length - 1 - id));
    if (pedidoAtualizado) {
      pedidoAtualizado.status = 'recebido';
      localStorage.setItem('compras_pedidos', JSON.stringify(pedidosParaSalvar));
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'a-caminho':
        return <FontAwesomeIcon icon={faTruck} />;
      case 'recebido':
        return <FontAwesomeIcon icon={faBox} />;
      case 'atrasado':
        return <FontAwesomeIcon icon={faExclamationTriangle} />;
      default:
        return <FontAwesomeIcon icon={faTruck} />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'a-caminho':
        return 'A Caminho';
      case 'recebido':
        return 'Recebido';
      case 'atrasado':
        return 'Atrasado';
      default:
        return 'A Caminho';
    }
  };

  // Filtro
  const pedidosFiltrados = pedidos.filter(p => {
    const produtoMatch = p.produto.toLowerCase().includes(busca.toLowerCase());
    const fornecedorMatch = p.fornecedor.toLowerCase().includes(busca.toLowerCase());
    const categoriaMatch = p.categoria.toLowerCase().includes(busca.toLowerCase());
    const statusFinal = verificarStatusAtrasado(p.dataRecebimento, p.status);
    const statusMatch = statusFiltro === 'todos' || statusFinal === statusFiltro;
    return (produtoMatch || fornecedorMatch || categoriaMatch) && statusMatch;
  });

  return (
    <div className="compras-page">
      <Voltar />
      <h1>Notas Fiscais de Compras</h1>
      <div className="filtros-compras">
        <input
          type="text"
          placeholder="Buscar por produto, fornecedor ou categoria..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
        />
        <select value={statusFiltro} onChange={e => setStatusFiltro(e.target.value)}>
          <option value="todos">Todos os Status</option>
          <option value="a-caminho">A Caminho</option>
          <option value="atrasado">Atrasado</option>
          <option value="recebido">Recebido</option>
        </select>
      </div>
      {pedidosFiltrados.length === 0 ? (
        <div className="sem-compras">Nenhuma compra registrada ainda.</div>
      ) : (
        <ul className="compras-lista">
          {pedidosFiltrados.map((pedido, idx) => {
            const statusFinal = verificarStatusAtrasado(pedido.dataRecebimento, pedido.status);
            
            return (
              <li key={idx} className={`compra-item ${expandido === idx ? 'expandido' : ''}`}>
                <div className="compra-cabecalho" onClick={() => handleExpandir(idx)}>
                  <div className="compra-header-topo">
                    <span className="compra-data-recebimento">
                      <FontAwesomeIcon icon={faCalendarAlt} /> {pedido.dataRecebimento}
                    </span>
                    <span className={`compra-status-badge ${statusFinal}`}>
                      {getStatusIcon(statusFinal)} {getStatusText(statusFinal)}
                    </span>
                  </div>
                  <div className="compra-header-principal">
                    <div className="compra-info-produto">
                      <span className="compra-produto">{pedido.produto}</span>
                      <span className="compra-separador">-</span>
                      <span className="compra-fornecedor">{pedido.fornecedor}</span>
                    </div>
                    <span className="compra-valor">R$ {parseFloat(pedido.custoTotal).toFixed(2)}</span>
                    <span className="compra-expand-icon">
                      <FontAwesomeIcon icon={expandido === idx ? faChevronUp : faChevronDown} />
                    </span>
                  </div>
                </div>
                {expandido === idx && (
                  <div className="compra-detalhes">
                    <div>
                      <b><FontAwesomeIcon icon={faCalendarAlt} /> Data da Compra:</b>
                      <span>{pedido.data}</span>
                    </div>
                    <div>
                      <b><FontAwesomeIcon icon={faCalendarAlt} /> Data Prevista:</b>
                      <span>{pedido.dataRecebimento}</span>
                    </div>
                    <div>
                      <b><FontAwesomeIcon icon={faBox} /> Produto:</b>
                      <span>{pedido.produto}</span>
                    </div>
                    <div>
                      <b>Categoria:</b>
                      <span>{pedido.categoria}</span>
                    </div>
                    <div>
                      <b><FontAwesomeIcon icon={faBuilding} /> Fornecedor:</b>
                      <span>{pedido.fornecedor}</span>
                    </div>
                    <div>
                      <b><FontAwesomeIcon icon={faPhone} /> Contato:</b>
                      <span>{pedido.contatoFornecedor}</span>
                    </div>
                    <div>
                      <b>Quantidade:</b>
                      <span>{pedido.quantidade} unidades</span>
                    </div>
                    <div>
                      <b>Preço Unitário:</b>
                      <span className="valor-destaque">R$ {parseFloat(pedido.preco).toFixed(2)}</span>
                    </div>
              {pedido.precoVenda && (
                      <div>
                        <b>Preço de Venda:</b>
                        <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>R$ {parseFloat(pedido.precoVenda).toFixed(2)}</span>
                      </div>
              )}
                    <div>
                      <b><FontAwesomeIcon icon={faDollarSign} /> Custo Total:</b>
                      <span className="valor-destaque">R$ {parseFloat(pedido.custoTotal).toFixed(2)}</span>
                    </div>
                    <div>
                      <b><FontAwesomeIcon icon={faTruck} /> Tempo de Entrega:</b>
                      <span><FontAwesomeIcon icon={faClock} /> {pedido.tempoEntrega} dias</span>
            </div>
                    {statusFinal !== 'recebido' && (
                      <button 
                        className="btn-marcar-concluido"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarcarConcluido(idx);
                        }}
                      >
                        <FontAwesomeIcon icon={faCheck} /> Marcar como Recebido
                      </button>
                    )}
        </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default Compra; 