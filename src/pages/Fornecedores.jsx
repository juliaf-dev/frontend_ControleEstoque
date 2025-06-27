import React, { useState, useEffect } from 'react';
import { fornecedorService } from '../services/fornecedorService';
import './Fornecedores.css';
import Voltar from '../components/Voltar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faEdit, faSave, faTimesCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

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
      <Voltar />
      <h1>Fornecedores</h1>
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
                <span className="fornecedor-nome">{f.nome}</span>
                <span className={`fornecedor-status-badge ${ativo ? 'ativo' : 'inativo'}`}>{ativo ? <FontAwesomeIcon icon={faCheckCircle} /> : <FontAwesomeIcon icon={faTimesCircle} />} {ativo ? 'Ativo' : 'Inativo'}</span>
                <span className="fornecedor-expand-icon">
                  <FontAwesomeIcon icon={expandido === f.id ? faChevronUp : faChevronDown} />
                </span>
              </div>
              {expandido === f.id && (
                <div className="fornecedor-detalhes">
                  <div><b>Status:</b> {ativo ? 'Ativo' : 'Inativo'}</div>
                  <div><b>Contato:</b> {editando === f.id ? (
                    <>
                      <input type="email" placeholder="E-mail" value={extra.email || ''} onChange={e => handleChangeExtra(f.id, 'email', e.target.value)} />
                      <input type="text" placeholder="Telefone" value={extra.telefone || ''} onChange={e => handleChangeExtra(f.id, 'telefone', e.target.value)} />
                    </>
                  ) : (
                    <>{extra.email || '---'} | {extra.telefone || '---'}</>
                  )}</div>
                  <div><b>Endereço:</b> {editando === f.id ? (
                    <input type="text" placeholder="Endereço" value={extra.endereco || ''} onChange={e => handleChangeExtra(f.id, 'endereco', e.target.value)} />
                  ) : (
                    extra.endereco || '---'
                  )}</div>
                  <div><b>Tempo de entrega:</b> {editando === f.id ? (
                    <input type="text" placeholder="Tempo de entrega" value={extra.tempo_entrega || ''} onChange={e => handleChangeExtra(f.id, 'tempo_entrega', e.target.value)} />
                  ) : (
                    extra.tempo_entrega || '---'
                  )}</div>
                  <div><b>Produtos vinculados:</b>
                    <ul className="fornecedor-produtos">
                      {getProdutosVinculados(f.id).map(p => (
                        <li key={p.id}>{p.nome}</li>
                      ))}
                    </ul>
                  </div>
                  {editando === f.id ? (
                    <button className="btn-salvar" onClick={() => handleSave(f.id)}><FontAwesomeIcon icon={faSave} /> Salvar</button>
                  ) : (
                    <button className="btn-editar" onClick={() => handleEdit(f.id)}><FontAwesomeIcon icon={faEdit} /> Editar</button>
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