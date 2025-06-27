import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import './ProdutosSection.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faBoxesStacked, faTag, faLayerGroup, faMoneyBillWave, faClipboardList, faIndustry, faFileAlt, faImage } from '@fortawesome/free-solid-svg-icons';

export default function ProdutosSection() {
  const [categoria, setCategoria] = useState('Todos');
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [fornecedoresPorProduto, setFornecedoresPorProduto] = useState({});

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
      <div className="produtos-lista">
        {produtosFiltrados.map(produto => (
          <div className={`produto-card${expanded[produto.id] ? ' expanded' : ''}`} key={produto.id} onClick={() => toggleExpand(produto.id)} tabIndex={0} style={{cursor: 'pointer'}}>
            <div className="imagem-simulada">
              <FontAwesomeIcon icon={faImage} />
            </div>
            <h3>{produto.nome}</h3>
            <p>Estoque: {produto.quantidade_estoque}</p>
            {expanded[produto.id] && (
              <div className="produto-extra">
                <p>{produto.descricao}</p>
                <div>
                  <b>Fornecedores:</b>
                  {fornecedoresPorProduto[produto.id] && fornecedoresPorProduto[produto.id].length > 0 ? (
                    <ul>
                      {fornecedoresPorProduto[produto.id].map(f => (
                        <li key={f.id}>{f.nome}</li>
                      ))}
                    </ul>
                  ) : (
                    <span> Sem fornecedores</span>
                  )}
                </div>
                <p><FontAwesomeIcon icon={faMoneyBillWave} style={{marginRight: 6}}/>R$ {parseFloat(produto.valor).toFixed(2)}</p>
                <p>Estoque: {produto.quantidade_estoque}</p>
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