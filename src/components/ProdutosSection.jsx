import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import './ProdutosSection.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faBoxesStacked, faTag, faLayerGroup, faMoneyBillWave, faClipboardList, faIndustry, faFileAlt, faImage, faBox, faThLarge, faList, faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';

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
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    nome: '',
    descricao: '',
    valor: '',
    vendapreco: '',
    quantidade_estoque: '',
    categoria_id: ''
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

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
    // Se o card clicado já está expandido, fecha ele
    if (expanded[id]) {
      setExpanded(prev => ({ ...prev, [id]: false }));
      return;
    }
    
    // Fecha todos os outros cards e expande apenas o clicado
    setExpanded({ [id]: true });
    
    // Busca os fornecedores apenas se ainda não buscou
    try {
      const res = await productService.getProductSuppliers(id);
      setFornecedoresPorProduto(prev => ({ ...prev, [id]: res.fornecedores || [] }));
    } catch (error) {
      setFornecedoresPorProduto(prev => ({ ...prev, [id]: [] }));
    }
  };

  const handleEditClick = (e, produto) => {
    e.stopPropagation(); // Impede que o card expanda
    setEditingProduct(produto);
    setEditForm({
      nome: produto.nome,
      descricao: produto.descricao || '',
      valor: produto.valor,
      vendapreco: produto.vendapreco || '',
      quantidade_estoque: produto.quantidade_estoque,
      categoria_id: produto.categoria?.id || ''
    });
  };

  const handleCloseEdit = () => {
    setEditingProduct(null);
    setEditForm({
      nome: '',
      descricao: '',
      valor: '',
      vendapreco: '',
      quantidade_estoque: '',
      categoria_id: ''
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleConfirmEdit = async () => {
    try {
      await productService.updateProduct(editingProduct.id, editForm);
      // Recarrega os dados para atualizar a lista
      await carregarDados();
      handleCloseEdit();
      setShowConfirmation(false);
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
    }
  };

  const handleCancelEdit = () => {
    setShowConfirmation(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
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
                  R$ {parseFloat(produto.vendapreco || produto.valor).toFixed(2)}
                </div>
              </div>
            </div>
            {expanded[produto.id] && (
              <div className="produto-extra">
                <div className="produto-extra-header">
                  <p><strong>Descrição:</strong> {produto.descricao}</p>
                  <button 
                    className="edit-button"
                    onClick={(e) => handleEditClick(e, produto)}
                    title="Editar produto"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                </div>
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

      {/* Modal de Edição */}
      {editingProduct && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Editar Produto</h3>
              <button className="close-button" onClick={handleCloseEdit}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="edit-form">
              <div className="form-group">
                <label>Nome:</label>
                <input
                  type="text"
                  name="nome"
                  value={editForm.nome}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Descrição:</label>
                <textarea
                  name="descricao"
                  value={editForm.descricao}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Valor de Compra:</label>
                  <input
                    type="number"
                    name="valor"
                    value={editForm.valor}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Valor de Venda:</label>
                  <input
                    type="number"
                    name="vendapreco"
                    value={editForm.vendapreco}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Estoque:</label>
                  <input
                    type="number"
                    name="quantidade_estoque"
                    value={editForm.quantidade_estoque}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Categoria:</label>
                <select
                  name="categoria_id"
                  value={editForm.categoria_id}
                  onChange={handleInputChange}
                >
                  <option value="">Selecione uma categoria</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-actions">
                <button type="button" onClick={handleCloseEdit} className="btn-cancel">
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tarja de Confirmação */}
      {showConfirmation && (
        <div className="confirmation-banner">
          <div className="confirmation-content">
            <div className="confirmation-message">
              <FontAwesomeIcon icon={faClipboardList} style={{marginRight: 8}}/>
              Tem certeza que deseja salvar as alterações neste produto?
            </div>
            <div className="confirmation-actions">
              <button onClick={handleCancelEdit} className="btn-cancel-confirm">
                Cancelar
              </button>
              <button onClick={handleConfirmEdit} className="btn-confirm">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
} 