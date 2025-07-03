import React, { useState, useEffect } from 'react';
import Voltar from '../components/Voltar';
import './Compra.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faCalendarAlt, faBox, faTruck, faDollarSign, faBuilding, faPhone, faClock, faCheck, faExclamationTriangle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { pedidoService } from '../services/pedidoService';
import { fornecedorService } from '../services/fornecedorService';

function Compra() {
  const [pedidos, setPedidos] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [expandido, setExpandido] = useState(null);
  const [busca, setBusca] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('todos');

  useEffect(() => {
    async function fetchPedidos() {
      try {
        const pedidosApi = await pedidoService.getPedidos();
        const pedidosComStatus = (pedidosApi || []).map(pedido => ({
          ...pedido,
          status: pedido.status || 'a-caminho',
          dataRecebimento: pedido.dataRecebimento || calcularDataRecebimento(pedido.tempo_entrega || pedido.tempoEntrega)
        }));
        setPedidos(pedidosComStatus);
      } catch {
        setPedidos([]);
      }
    }
    async function fetchFornecedores() {
      try {
        const lista = await fornecedorService.getFornecedores();
        setFornecedores(lista);
      } catch {
        setFornecedores([]);
      }
    }
    fetchPedidos();
    fetchFornecedores();
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

  const handleMarcarConcluido = async (id) => {
    try {
      const pedido = pedidos[id];
      if (!pedido.id) {
        alert('Este pedido não está registrado no banco de dados.');
        return;
      }
      await pedidoService.receberPedido(pedido.id);
      const pedidosApi = await pedidoService.getPedidos();
      const pedidosComStatus = (pedidosApi || []).map(pedido => ({
        ...pedido,
        status: pedido.status || 'a-caminho',
        dataRecebimento: pedido.dataRecebimento || calcularDataRecebimento(pedido.tempo_entrega || pedido.tempoEntrega)
      }));
      setPedidos(pedidosComStatus);
    } catch (error) {
      alert(error.message || 'Erro ao marcar pedido como recebido');
    }
  };

  const handleCancelar = async (id) => {
    try {
      const pedido = pedidos[id];
      if (!pedido.id) {
        alert('Este pedido não está registrado no banco de dados.');
        return;
      }
      await pedidoService.cancelarPedido(pedido.id);
      const pedidosApi = await pedidoService.getPedidos();
      const pedidosComStatus = (pedidosApi || []).map(pedido => ({
        ...pedido,
        status: pedido.status || 'a-caminho',
        dataRecebimento: pedido.dataRecebimento || calcularDataRecebimento(pedido.tempo_entrega || pedido.tempoEntrega)
      }));
      setPedidos(pedidosComStatus);
    } catch (error) {
      alert(error.message || 'Erro ao cancelar pedido');
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
      case 'cancelada':
        return <FontAwesomeIcon icon={faTimesCircle} />;
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
      case 'cancelada':
        return 'Cancelada';
      default:
        return 'A Caminho';
    }
  };

  // Filtro
  const pedidosFiltrados = pedidos.filter(p => {
    const produtoMatch = (p.produto || p.nome || '').toLowerCase().includes(busca.toLowerCase());
    // Busca fornecedor pelo nome, usando a lista de fornecedores
    const fornecedorObj = fornecedores.find(f => f.id === p.fornecedor_id || f.id === p.fornecedorId || f.id === p.fornecedor);
    const nomeFornecedor = fornecedorObj ? fornecedorObj.nome : (p.fornecedor || 'N/A');
    const fornecedorMatch = nomeFornecedor.toLowerCase().includes(busca.toLowerCase());
    const categoriaMatch = (p.categoria || '').toLowerCase().includes(busca.toLowerCase());
    const statusFinal = verificarStatusAtrasado(p.dataRecebimento, p.status);
    const statusMatch = statusFiltro === 'todos' || statusFinal === statusFiltro;
    return (produtoMatch || fornecedorMatch || categoriaMatch) && statusMatch;
  });

  return (
    <div className="compras-page">
      <Voltar showHome={true} title="Voltar às Compras" />
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
          <option value="cancelada">Cancelada</option>
        </select>
      </div>
      {pedidosFiltrados.length === 0 ? (
        <div className="sem-compras">Nenhuma compra registrada ainda.</div>
      ) : (
        <ul className="compras-lista">
          {pedidosFiltrados.map((pedido, idx) => {
            const statusFinal = verificarStatusAtrasado(pedido.dataRecebimento, pedido.status);
            // Busca fornecedor pelo id
            const fornecedorObj = fornecedores.find(f => f.id === pedido.fornecedor_id || f.id === pedido.fornecedorId || f.id === pedido.fornecedor);
            const nomeFornecedor = fornecedorObj ? fornecedorObj.nome : (pedido.fornecedor || 'N/A');
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
                      <span className="compra-produto">{pedido.produto || pedido.nome}</span>
                      <span className="compra-separador">-</span>
                      <span className="compra-fornecedor">{nomeFornecedor}</span>
                    </div>
                    <span className="compra-valor">R$ {parseFloat((pedido.valor || 0) * (pedido.quantidade || 1)).toFixed(2)}</span>
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
                      <span>{pedido.produto || pedido.nome}</span>
                    </div>
                    <div>
                      <b>Categoria:</b>
                      <span>{pedido.categoria || 'N/A'}</span>
                    </div>
                    <div>
                      <b><FontAwesomeIcon icon={faBuilding} /> Fornecedor:</b>
                      <span>{nomeFornecedor}</span>
                    </div>
                    <div>
                      <b><FontAwesomeIcon icon={faPhone} /> Contato:</b>
                      <span>
                        {pedido.emailFornecedor || ''}
                        {pedido.emailFornecedor && pedido.telefoneFornecedor ? ' / ' : ''}
                        {pedido.telefoneFornecedor || ''}
                      </span>
                    </div>
                    <div>
                      <b>Quantidade:</b>
                      <span>{pedido.quantidade} unidades</span>
                    </div>
                    <div>
                      <b>Preço Unitário:</b>
                      <span className="valor-destaque">R$ {parseFloat(pedido.valor || 0).toFixed(2)}</span>
                    </div>
                    <div>
                      <b><FontAwesomeIcon icon={faDollarSign} /> Custo Total:</b>
                      <span className="valor-destaque">R$ {parseFloat((pedido.valor || 0) * (pedido.quantidade || 1)).toFixed(2)}</span>
                    </div>
                    <div>
                      <b><FontAwesomeIcon icon={faTruck} /> Tempo de Entrega:</b>
                      <span><FontAwesomeIcon icon={faClock} /> {pedido.tempo_entrega || pedido.tempoEntrega || 'N/A'} dias</span>
                    </div>
                    {statusFinal !== 'recebido' && statusFinal !== 'cancelada' && (
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
                    {statusFinal !== 'recebido' && statusFinal !== 'cancelada' && (
                      <button 
                        className="btn-cancelar"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelar(idx);
                        }}
                      >
                        <FontAwesomeIcon icon={faTimesCircle} /> Cancelar Compra
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