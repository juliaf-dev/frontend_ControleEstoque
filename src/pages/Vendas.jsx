import React, { useState, useEffect, useRef } from 'react';
import Voltar from '../components/Voltar';
import { productService } from '../services/productService';
import { clientService } from '../services/clientService';
import { pedidoService } from '../services/pedidoService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCartPlus, faCheckCircle, faShoppingCart, faReceipt, faPlus, faUserPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import './Vendas.css';

export default function Vendas() {
  const [produtos, setProdutos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [clienteId, setClienteId] = useState('');
  const [produtoId, setProdutoId] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [carrinho, setCarrinho] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [estoqueDisp, setEstoqueDisp] = useState(null);
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [novoCliente, setNovoCliente] = useState({ nome: '', email: '', telefone: '' });
  const [erroCliente, setErroCliente] = useState('');
  const produtoSelectRef = useRef(null);
  const quantidadeInputRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const produtosData = await productService.getProducts();
        setProdutos(produtosData.data || []);
        const clientesData = await clientService.getClients();
        setClientes(clientesData.data || []);
      } catch (error) {
        setErro('Erro ao carregar produtos ou clientes');
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (produtoId) {
      const prod = produtos.find(p => String(p.id) === produtoId);
      setEstoqueDisp(prod ? prod.quantidade_estoque : null);
      setQuantidade('1');
    } else {
      setEstoqueDisp(null);
      setQuantidade('');
    }
  }, [produtoId, produtos]);

  const handleAddProduto = () => {
    setMensagem('');
    setErro('');
    if (!produtoId || !quantidade || isNaN(Number(quantidade)) || Number(quantidade) <= 0) {
      setErro('Selecione um produto e informe uma quantidade válida.');
      return;
    }
    const produto = produtos.find(p => String(p.id) === produtoId);
    if (!produto) {
      setErro('Produto não encontrado.');
      return;
    }
    if (Number(quantidade) > produto.quantidade_estoque) {
      setErro('Quantidade maior que o estoque disponível.');
      return;
    }
    setCarrinho(prev => {
      const existente = prev.find(item => item.produto.id === produto.id);
      if (existente) {
        return prev.map(item =>
          item.produto.id === produto.id
            ? { ...item, quantidade: item.quantidade + Number(quantidade) }
            : item
        );
      }
      return [...prev, { produto, quantidade: Number(quantidade) }];
    });
    setProdutoId('');
    setQuantidade('');
    setEstoqueDisp(null);
    setTimeout(() => {
      produtoSelectRef.current && produtoSelectRef.current.focus();
    }, 100);
  };

  const handleRemover = (id) => {
    setCarrinho(prev => prev.filter(item => item.produto.id !== id));
  };

  const handleFinalizar = async () => {
    setMensagem('');
    setErro('');
    if (!clienteId) {
      setErro('Selecione um cliente.');
      return;
    }
    if (carrinho.length === 0) {
      setErro('Adicione pelo menos um produto ao carrinho.');
      return;
    }
    try {
      for (const item of carrinho) {
        await pedidoService.createPedido({
          codigo: Date.now() + Math.floor(Math.random() * 1000),
          nome: item.produto.nome,
          valor: item.produto.valor * item.quantidade,
          tipo: 'venda',
          produto_id: item.produto.id,
          cliente_id: clienteId
        });
      }
      setMensagem('Venda registrada com sucesso!');
      setCarrinho([]);
      setClienteId('');
      setProdutoId('');
      setQuantidade('');
      setEstoqueDisp(null);
    } catch (error) {
      setErro(error.message || 'Erro ao registrar venda');
    }
  };

  const handleOpenClienteModal = () => {
    setShowClienteModal(true);
    setErroCliente('');
    setNovoCliente({ nome: '', email: '', telefone: '' });
  };

  const handleCloseClienteModal = () => {
    setShowClienteModal(false);
    setErroCliente('');
    setNovoCliente({ nome: '', email: '', telefone: '' });
  };

  const handleCadastrarCliente = async () => {
    setErroCliente('');
    if (!novoCliente.nome.trim()) {
      setErroCliente('Nome é obrigatório.');
      return;
    }
    try {
      const response = await clientService.createClient(novoCliente);
      const clienteCriado = response.data;
      setClientes(prev => [...prev, clienteCriado]);
      setClienteId(clienteCriado.id);
      handleCloseClienteModal();
      setMensagem('Cliente cadastrado com sucesso!');
    } catch (error) {
      setErroCliente(error.message || 'Erro ao cadastrar cliente');
    }
  };

  const total = carrinho.reduce((acc, item) => acc + (item.produto.valor * item.quantidade), 0);

  return (
    <div className="vendas-page">
      <Voltar showHome={true} title="Voltar ao Caixa" />
      <h1><FontAwesomeIcon icon={faReceipt} style={{marginRight: '0.5rem'}} />Vendas</h1>
      <div className="vendas-layout">
        <div className="vendas-form">
          <h3><FontAwesomeIcon icon={faShoppingCart} style={{marginRight: '0.5rem'}} />Adicionar Produtos</h3>
          <div className="form-row">
          <div className="form-group">
            <label>Cliente:</label>
              <div className="cliente-container">
            <select value={clienteId} onChange={e => setClienteId(e.target.value)} required>
              <option value="">Selecione um cliente</option>
              {clientes.map(c => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
                <button type="button" className="btn-add-cliente" onClick={handleOpenClienteModal} title="Adicionar Novo Cliente">
                  <FontAwesomeIcon icon={faUserPlus} />
                </button>
              </div>
            </div>
          </div>
          <div className="form-row">
          <div className="form-group">
            <label>Produto:</label>
            <select ref={produtoSelectRef} value={produtoId} onChange={e => setProdutoId(e.target.value)}>
              <option value="">Selecione um produto</option>
              {produtos.map(p => (
                <option key={p.id} value={p.id}>{p.nome} (Estoque: {p.quantidade_estoque})</option>
              ))}
            </select>
            </div>
            <div className="form-group">
              <label>Quantidade:</label>
              <div className="quantidade-container">
                <input ref={quantidadeInputRef} type="number" min="1" value={quantidade} onChange={e => setQuantidade(e.target.value)} />
                <button type="button" className="btn-add-small" onClick={handleAddProduto} title="Adicionar ao Carrinho">
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
              {erro && <div className="mensagem-erro-inline">{erro}</div>}
            </div>
          </div>
          {estoqueDisp !== null && (
            <div className="estoque-disp">Estoque disponível: <b>{estoqueDisp}</b></div>
          )}
        </div>
        <div className="carrinho-section">
          <h2><FontAwesomeIcon icon={faShoppingCart} style={{marginRight: '0.5rem'}} />Carrinho</h2>
          {carrinho.length === 0 ? (
            <div className="carrinho-vazio">
              <FontAwesomeIcon icon={faShoppingCart} style={{fontSize: '2rem', marginBottom: '1rem', opacity: 0.5}} />
              <div>Nenhum produto no carrinho.</div>
            </div>
          ) : (
            <table className="carrinho-tabela">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Qtd</th>
                  <th>Preço</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {carrinho.map(item => (
                  <tr key={item.produto.id}>
                    <td className="produto-nome">{item.produto.nome}</td>
                    <td className="quantidade">{item.quantidade}</td>
                    <td className="preco">R$ {Number(item.produto.valor).toFixed(2)}</td>
                    <td className="subtotal">R$ {(item.produto.valor * item.quantidade).toFixed(2)}</td>
                    <td>
                      <button className="btn-remover" onClick={() => handleRemover(item.produto.id)} title="Remover">
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="total-label">Total:</td>
                  <td colSpan={2} className="total-valor">R$ {total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          )}
          <button className="btn-finalizar" onClick={handleFinalizar} disabled={carrinho.length === 0 || !clienteId}>
            <FontAwesomeIcon icon={faCheckCircle} /> Finalizar Venda
          </button>
        </div>
      </div>
      {mensagem && <div className="mensagem-sucesso">{mensagem}</div>}
      
      {/* Modal de Cadastro de Cliente */}
      {showClienteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3><FontAwesomeIcon icon={faUserPlus} style={{marginRight: '0.5rem'}} />Cadastrar Novo Cliente</h3>
              <button className="btn-close" onClick={handleCloseClienteModal}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Nome:</label>
                <input 
                  type="text" 
                  value={novoCliente.nome} 
                  onChange={e => setNovoCliente(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Nome completo"
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input 
                  type="email" 
                  value={novoCliente.email} 
                  onChange={e => setNovoCliente(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div className="form-group">
                <label>Telefone:</label>
                <input 
                  type="text" 
                  value={novoCliente.telefone} 
                  onChange={e => setNovoCliente(prev => ({ ...prev, telefone: e.target.value }))}
                  placeholder="(11) 99999-9999"
                />
              </div>
              {erroCliente && <div className="mensagem-erro-inline">{erroCliente}</div>}
            </div>
            <div className="modal-footer">
              <button className="btn-cancelar" onClick={handleCloseClienteModal}>
                Cancelar
              </button>
              <button className="btn-cadastrar" onClick={handleCadastrarCliente}>
                <FontAwesomeIcon icon={faUserPlus} /> Cadastrar Cliente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 