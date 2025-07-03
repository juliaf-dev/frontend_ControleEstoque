import React, { useState, useEffect } from 'react';
import Voltar from '../components/Voltar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory, faArrowUp, faArrowDown, faChartLine, faChevronDown, faChevronUp, faCalendarAlt, faBox, faDollarSign, faUser, faCode } from '@fortawesome/free-solid-svg-icons';
import './Historicos.css';
import { pedidoService } from '../services/pedidoService';

export default function Historicos() {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [filtro, setFiltro] = useState('todos'); // todos, vendas, compras
  const [expandido, setExpandido] = useState(null);
  const [busca, setBusca] = useState('');
  const [resumo, setResumo] = useState({
    totalVendas: 0,
    totalCompras: 0,
    lucro: 0
  });

  useEffect(() => {
    carregarHistorico();
  }, []);

  const carregarHistorico = async () => {
    try {
      setLoading(true);
      const pedidos = await pedidoService.getPedidos();
      // Ordenar do mais recente para o mais antigo
      pedidos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      // Processar dados para calcular resumo
      const vendas = pedidos.filter(p => p.tipo === 'venda');
      const compras = pedidos.filter(p => p.tipo === 'compra');
      const totalVendas = vendas.reduce((acc, venda) => acc + Number(venda.valor), 0);
      const totalCompras = compras.reduce((acc, compra) => acc + Number(compra.valor), 0);
      const lucro = totalVendas - totalCompras;
      setResumo({
        totalVendas,
        totalCompras,
        lucro
      });
      setHistorico(pedidos);
    } catch (error) {
      setErro('Erro ao carregar histórico');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExpandir = (id) => {
    setExpandido(expandido === id ? null : id);
  };

  const filtrarHistorico = () => {
    let filtrado = historico;
    
    if (filtro !== 'todos') {
      filtrado = historico.filter(item => item.tipo === filtro);
    }
    
    if (busca) {
      filtrado = filtrado.filter(item => 
        item.nome.toLowerCase().includes(busca.toLowerCase()) ||
        item.codigo.toLowerCase().includes(busca.toLowerCase()) ||
        (item.cliente && item.cliente.toLowerCase().includes(busca.toLowerCase())) ||
        (item.fornecedor && item.fornecedor.toLowerCase().includes(busca.toLowerCase()))
      );
    }
    
    return filtrado;
  };

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatarValor = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const historicoFiltrado = filtrarHistorico();

  return (
    <div className="historicos-page">
      <Voltar showHome={true} title="Voltar ao Menu" />
      <h1>
        <FontAwesomeIcon icon={faHistory} style={{marginRight: '0.5rem'}} />
        Histórico de Movimentos
      </h1>

      {/* Resumo Financeiro */}
      <div className="resumo-financeiro">
        <div className="resumo-card vendas">
          <div className="resumo-icon">
            <FontAwesomeIcon icon={faArrowUp} />
          </div>
          <div className="resumo-info">
            <h3>Total de Vendas</h3>
            <span className="valor-positivo">{formatarValor(resumo.totalVendas)}</span>
          </div>
        </div>

        <div className="resumo-card compras">
          <div className="resumo-icon">
            <FontAwesomeIcon icon={faArrowDown} />
          </div>
          <div className="resumo-info">
            <h3>Total de Compras</h3>
            <span className="valor-negativo">{formatarValor(resumo.totalCompras)}</span>
          </div>
        </div>

        <div className="resumo-card lucro">
          <div className="resumo-icon">
            <FontAwesomeIcon icon={faChartLine} />
          </div>
          <div className="resumo-info">
            <h3>Lucro Total</h3>
            <span className={resumo.lucro >= 0 ? 'valor-positivo' : 'valor-negativo'}>
              {formatarValor(resumo.lucro)}
            </span>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="filtros-container">
        <div className="filtros-row">
          <input
            type="text"
            placeholder="Buscar por produto, código, cliente ou fornecedor..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="filtro-busca"
          />
          <select value={filtro} onChange={e => setFiltro(e.target.value)} className="filtro-select">
            <option value="todos">Todos os Movimentos</option>
            <option value="venda">Apenas Vendas</option>
            <option value="compra">Apenas Compras</option>
          </select>
        </div>
      </div>

      {/* Lista de Movimentos */}
      <div className="historico-container">
        {loading ? (
          <div className="loading">
            <FontAwesomeIcon icon={faHistory} spin style={{fontSize: '2rem', marginBottom: '1rem'}} />
            <p>Carregando histórico...</p>
          </div>
        ) : erro ? (
          <div className="erro">
            <p>{erro}</p>
          </div>
        ) : historicoFiltrado.length === 0 ? (
          <div className="historico-vazio">
            <FontAwesomeIcon icon={faHistory} style={{fontSize: '3rem', marginBottom: '1rem', opacity: 0.5}} />
            <h3>Nenhum movimento encontrado</h3>
            <p>Não há {filtro === 'todos' ? 'movimentos' : filtro === 'venda' ? 'vendas' : 'compras'} registrados ainda.</p>
          </div>
        ) : (
          <ul className="movimentos-lista">
            {historicoFiltrado.map((movimento) => (
              <li key={movimento.id} className={`movimento-item ${expandido === movimento.id ? 'expandido' : ''} ${movimento.tipo}`}>
                <div className="movimento-cabecalho" onClick={() => handleExpandir(movimento.id)}>
                  <div className="movimento-header-topo">
                    <span className="movimento-data">
                      <FontAwesomeIcon icon={faCalendarAlt} /> {formatarData(movimento.createdAt)}
                    </span>
                    <span className={`movimento-tipo-badge ${movimento.tipo}`}>
                      <FontAwesomeIcon icon={movimento.tipo === 'venda' ? faArrowUp : faArrowDown} />
                      {movimento.tipo === 'venda' ? 'Venda' : 'Compra'}
                    </span>
                  </div>
                  <div className="movimento-header-principal">
                    <div className="movimento-info-produto">
                      <span className="movimento-produto">{movimento.nome}</span>
                      <span className="movimento-separador">-</span>
                      <span className="movimento-pessoa">
                        {movimento.tipo === 'venda' ? movimento.cliente : movimento.fornecedor}
                      </span>
                    </div>
                    <span className={`movimento-valor ${movimento.tipo === 'venda' ? 'valor-positivo' : 'valor-negativo'}`}>
                      {movimento.tipo === 'venda' ? '+' : '-'} {formatarValor(movimento.valor)}
                    </span>
                    <span className="movimento-expand-icon">
                      <FontAwesomeIcon icon={expandido === movimento.id ? faChevronUp : faChevronDown} />
                    </span>
                  </div>
                </div>
                {expandido === movimento.id && (
                  <div className="movimento-detalhes">
                    <div>
                      <b><FontAwesomeIcon icon={faCalendarAlt} /> Data do Movimento:</b>
                      <span>{formatarData(movimento.createdAt)}</span>
                    </div>
                    <div>
                      <b><FontAwesomeIcon icon={faCode} /> Código:</b>
                      <span>{movimento.codigo}</span>
                    </div>
                    <div>
                      <b><FontAwesomeIcon icon={faBox} /> Produto:</b>
                      <span>{movimento.nome}</span>
                    </div>
                    <div>
                      <b>Quantidade:</b>
                      <span>{movimento.quantidade} unidades</span>
                    </div>
                    <div>
                      <b><FontAwesomeIcon icon={faUser} /> {movimento.tipo === 'venda' ? 'Cliente:' : 'Fornecedor:'}</b>
                      <span>{movimento.tipo === 'venda' ? movimento.cliente : movimento.fornecedor}</span>
                    </div>
                    <div>
                      <b><FontAwesomeIcon icon={faDollarSign} /> Valor Total:</b>
                      <span className={`valor-destaque ${movimento.tipo === 'venda' ? 'valor-positivo' : 'valor-negativo'}`}>
                        {formatarValor(movimento.valor)}
                      </span>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 