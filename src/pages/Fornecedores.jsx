import React, { useState, useEffect } from 'react';
import { fornecedorService } from '../services/fornecedorService';
import './Fornecedores.css';
import Voltar from '../components/Voltar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faEdit, faSave, faTimesCircle, faCheckCircle, faTimes } from '@fortawesome/free-solid-svg-icons';

function getLocalExtras(id) {
  const extras = JSON.parse(localStorage.getItem('fornecedor_extras') || '{}');
  return extras[id] || { tempo_entrega: '', endereco: '', email: '', telefone: '' };
}
function setLocalExtras(id, data) {
  const extras = JSON.parse(localStorage.getItem('fornecedor_extras') || '{}');
  extras[id] = { ...extras[id], ...data };
  localStorage.setItem('fornecedor_extras', JSON.stringify(extras));
}

export default function Fornecedores() {
  const [fornecedores, setFornecedores] = useState([]);
  const [expandido, setExpandido] = useState(null);
  const [busca, setBusca] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('todos');
  const [editando, setEditando] = useState(null);
  const [extras, setExtras] = useState({});
  const [produtosPorFornecedor, setProdutosPorFornecedor] = useState({});

  useEffect(() => {
    fornecedorService.getFornecedores().then(data => {
      setFornecedores(data || []);
      // Carrega extras do localStorage
      const allExtras = JSON.parse(localStorage.getItem('fornecedor_extras') || '{}');
      setExtras(allExtras);
    });
  }, []);

  const handleExpandir = async (id) => {
    setExpandido(expandido === id ? null : id);
    if (expandido !== id) {
      // Buscar produtos vinculados do backend
      try {
        const res = await fornecedorService.getProdutosDoFornecedor(id);
        setProdutosPorFornecedor(prev => ({ ...prev, [id]: res.data || [] }));
      } catch {
        setProdutosPorFornecedor(prev => ({ ...prev, [id]: [] }));
      }
    }
  };

  const handleEdit = (id) => {
    setEditando(id);
  };

  const handleSave = (id) => {
    setLocalExtras(id, extras[id]);
    setEditando(null);
  };

  const handleChangeExtra = (id, campo, valor) => {
    setExtras(prev => ({
      ...prev,
      [id]: { ...prev[id], [campo]: valor }
    }));
  };

  // Filtro
  const fornecedoresFiltrados = fornecedores.filter(f => {
    const nomeMatch = f.nome.toLowerCase().includes(busca.toLowerCase());
    const statusMatch = statusFiltro === 'todos' || (statusFiltro === 'ativo' && f.situacao === 1) || (statusFiltro === 'inativo' && f.situacao === 0);
    return nomeMatch && statusMatch;
  });

  // Buscar produtos vinculados do localStorage
  function getProdutosVinculados(id) {
    return produtosPorFornecedor[id] || [];
  }

  return (
    <div className="fornecedores-page">
      <Voltar showHome={true} title="Voltar aos Fornecedores" />
      <h1>Gerenciar Fornecedores</h1>
      <div className="filtros-fornecedores">
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
        />
        <select value={statusFiltro} onChange={e => setStatusFiltro(e.target.value)}>
          <option value="todos">Todos</option>
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
        </select>
      </div>
      <ul className="fornecedores-lista">
        {fornecedoresFiltrados.map(f => {
          const extra = extras[f.id] || getLocalExtras(f.id);
          const ativo = f.situacao === 1;
          return (
            <li key={f.id} className="fornecedor-item">
              <div className="fornecedor-cabecalho" onClick={() => handleExpandir(f.id)}>
                <div className="fornecedor-info">
                  {ativo ? (
                    <FontAwesomeIcon icon={faCheckCircle} className="fornecedor-status-icon" />
                  ) : (
                    <FontAwesomeIcon icon={faTimesCircle} className="fornecedor-status-icon inativo" />
                  )}
                <span className="fornecedor-nome">{f.nome}</span>
                </div>
                <span className="fornecedor-expand-icon">
                  <FontAwesomeIcon icon={expandido === f.id ? faChevronUp : faChevronDown} />
                </span>
              </div>
              {expandido === f.id && (
                <div className="fornecedor-detalhes">
                  {editando === f.id ? (
                    <button className="btn-cancel-icon" onClick={() => setEditando(null)}>
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  ) : (
                    <button className="btn-edit-icon" onClick={() => handleEdit(f.id)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                  )}
                  <div><b>Status:</b> {editando === f.id ? (
                    <select value={f.situacao} onChange={e => setFornecedores(prev => prev.map(item => item.id === f.id ? { ...item, situacao: Number(e.target.value) } : item))}>
                      <option value={1}>Ativo</option>
                      <option value={0}>Inativo</option>
                    </select>
                  ) : (
                    ativo ? 'Ativo' : 'Inativo'
                  )}</div>
                  <div><b>Email:</b> {f.email || '---'}</div>
                  <div><b>Telefone:</b> {f.telefone || '---'}</div>
                  <div><b>Tempo de entrega:</b> {editando === f.id ? (
                    <input type="number" min="1" value={f.tempo_entrega || ''} onChange={e => setFornecedores(prev => prev.map(item => item.id === f.id ? { ...item, tempo_entrega: e.target.value } : item))} />
                  ) : (
                    <>{f.tempo_entrega || '---'} dias</>
                  )}</div>
                  {editando === f.id && (
                    <button className="btn-salvar" onClick={() => handleSave(f.id)}><FontAwesomeIcon icon={faSave} /> Salvar</button>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {fornecedoresFiltrados.length === 0 && (
        <div className="sem-fornecedores">Nenhum fornecedor encontrado.</div>
      )}
    </div>
  );
} 