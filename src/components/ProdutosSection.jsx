import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import './ProdutosSection.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faBoxesStacked, faTag, faLayerGroup, faMoneyBillWave, faClipboardList, faIndustry, faFileAlt, faImage, faBox, faThLarge, faList } from '@fortawesome/free-solid-svg-icons';

export default function ProdutosSection() {
  const [categoria, setCategoria] = useState('Todos');
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [fornecedoresPorProduto, setFornecedoresPorProduto] = useState({});
  const [viewMode, setViewMode] = useState('cards'); // 'cards' ou 'list'

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [produtosRes, categoriasRes] = await Promise.all([
        productService.getProducts(),
        categoryService.getCategories()
      ]);
      
      setProdutos(produtosRes.data || []);
      setCategorias(categoriasRes.data || []);
    } catch (error) {
      setErro('Erro ao carregar dados');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const produtosFiltrados = categoria === 'Todos' 
    ? produtos 
    : produtos.filter(p => p.categoria?.nome === categoria);

  const toggleExpand = async (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    if (!expanded[id]) {
      // Só busca se ainda não buscou
      try {
        const res = await productService.getProductSuppliers(id);
        setFornecedoresPorProduto(prev => ({ ...prev, [id]: res.fornecedores || [] }));
      } catch (error) {
        setFornecedoresPorProduto(prev => ({ ...prev, [id]: [] }));
      }
    }
  };

  if (loading) {
    return <div className="loading"><FontAwesomeIcon icon={faBoxesStacked} spin style={{marginRight: 8}}/>Carregando produtos...</div>;
  }

  if (erro) {
    return <div className="erro"><FontAwesomeIcon icon={faClipboardList} style={{marginRight: 8}}/>{erro}</div>;
  }

  return (
    <section className="produtos-section">
      <div className="produtos-controls">
      <div className="filtro-categorias-dropdown">
        <button className="dropdown-toggle" onClick={() => setDropdownOpen(!dropdownOpen)}>
          <FontAwesomeIcon icon={faLayerGroup} style={{marginRight: 8}}/>
          {categoria}
          <FontAwesomeIcon icon={faChevronDown} style={{marginLeft: 8, transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'none'}}/>
        </button>
        {dropdownOpen && (
          <div className="dropdown-menu">
            <div className={`dropdown-item${categoria === 'Todos' ? ' ativo' : ''}`} onClick={() => {setCategoria('Todos'); setDropdownOpen(false);}}>
              <FontAwesomeIcon icon={faLayerGroup} style={{marginRight: 8}}/> sem filtro
            </div>
            {categorias.map(cat => (
              <div key={cat.id} className={`dropdown-item${categoria === cat.nome ? ' ativo' : ''}`} onClick={() => {setCategoria(cat.nome); setDropdownOpen(false);}}>
                <FontAwesomeIcon icon={faTag} style={{marginRight: 8}}/> {cat.nome}
              </div>
            ))}
          </div>
        )}
      </div>
        <div className="view-mode-toggle">
          <button 
            className={`view-btn ${viewMode === 'cards' ? 'active' : ''}`} 
            onClick={() => setViewMode('cards')}
            title="Visualização em Cards"
          >
            <FontAwesomeIcon icon={faThLarge} />
          </button>
          <button 
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} 
            onClick={() => setViewMode('list')}
            title="Visualização em Lista"
          >
            <FontAwesomeIcon icon={faList} />
          </button>
        </div>
      </div>
      <div className={`produtos-lista ${viewMode === 'list' ? 'list-view' : 'cards-view'}`}>
        {produtosFiltrados.map(produto => (
          <div className={`produto-card${expanded[produto.id] ? ' expanded' : ''} ${viewMode === 'list' ? 'list-item' : ''}`} key={produto.id} onClick={() => toggleExpand(produto.id)} tabIndex={0} style={{cursor: 'pointer'}}>
            <div className="produto-header">
            <div className="imagem-simulada">
              <FontAwesomeIcon icon={faImage} />
            </div>
              <div className="produto-info">
            <h3>{produto.nome}</h3>
                <div className="estoque-info">
                  <FontAwesomeIcon icon={faBox} />
                  Estoque: {produto.quantidade_estoque} unidades
                </div>
                <div className="preco-info">
                  <FontAwesomeIcon icon={faMoneyBillWave} />
                  R$ {parseFloat(produto.valor).toFixed(2)}
                </div>
              </div>
            </div>
            {expanded[produto.id] && (
              <div className="produto-extra">
                <p><strong>Descrição:</strong> {produto.descricao}</p>
                <p><strong>Fornecedores:</strong></p>
                  {fornecedoresPorProduto[produto.id] && fornecedoresPorProduto[produto.id].length > 0 ? (
                  <ul className="fornecedores-lista">
                      {fornecedoresPorProduto[produto.id].map(f => (
                      <li key={f.id}>
                        <FontAwesomeIcon icon={faIndustry} style={{marginRight: 6}}/>
                        {f.nome}
                      </li>
                      ))}
                    </ul>
                  ) : (
                  <p style={{color: 'var(--dark-gray)', fontStyle: 'italic'}}>Sem fornecedores cadastrados</p>
                  )}
              </div>
            )}
          </div>
        ))}
      </div>
      {produtosFiltrados.length === 0 && (
        <div className="sem-produtos">
          <FontAwesomeIcon icon={faClipboardList} style={{marginRight: 8}}/>
          Nenhum produto encontrado para esta categoria.
        </div>
      )}
    </section>
  );
} 