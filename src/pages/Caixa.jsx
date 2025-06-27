import React, { useState, useEffect, useRef } from 'react';
import Voltar from '../components/Voltar';
import { productService } from '../services/productService';
import { clientService } from '../services/clientService';
import { pedidoService } from '../services/pedidoService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCartPlus, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import './Caixa.css';

export default function Caixa() {
  const [produtos, setProdutos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [clienteId, setClienteId] = useState('');
  const [produtoId, setProdutoId] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [carrinho, setCarrinho] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [estoqueDisp, setEstoqueDisp] = useState(null);
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
    } else {
      setEstoqueDisp(null);
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

  const total = carrinho.reduce((acc, item) => acc + (item.produto.valor * item.quantidade), 0);

  return (
    <div className="caixa-page">
      <Voltar />
      <h1>Caixa (Venda)</h1>
      <div className="caixa-layout">
        <div className="caixa-form">
          <div className="form-group">
            <label>Cliente:</label>
            <select value={clienteId} onChange={e => setClienteId(e.target.value)} required>
              <option value="">Selecione um cliente</option>
              {clientes.map(c => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Produto:</label>
            <select ref={produtoSelectRef} value={produtoId} onChange={e => setProdutoId(e.target.value)}>
              <option value="">Selecione um produto</option>
              {produtos.map(p => (
                <option key={p.id} value={p.id}>{p.nome} (Estoque: {p.quantidade_estoque})</option>
              ))}
            </select>
          </div>
          {estoqueDisp !== null && (
            <div className="estoque-disp">Estoque disponível: <b>{estoqueDisp}</b></div>
          )}
          <div className="form-group">
            <label>Quantidade:</label>
            <input ref={quantidadeInputRef} type="number" min="1" value={quantidade} onChange={e => setQuantidade(e.target.value)} />
          </div>
          <button type="button" className="btn-adicionar" onClick={handleAddProduto}>
            <FontAwesomeIcon icon={faCartPlus} style={{marginRight: 6}} /> Adicionar ao Carrinho
          </button>
        </div>
        <div className="carrinho-section">
          <h2>Carrinho</h2>
          {carrinho.length === 0 ? (
            <div className="carrinho-vazio">Nenhum produto no carrinho.</div>
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
                    <td>{item.produto.nome}</td>
                    <td>{item.quantidade}</td>
                    <td>R$ {Number(item.produto.valor).toFixed(2)}</td>
                    <td>R$ {(item.produto.valor * item.quantidade).toFixed(2)}</td>
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
                  <td colSpan={3} style={{textAlign: 'right', fontWeight: 'bold'}}>Total:</td>
                  <td colSpan={2} style={{fontWeight: 'bold'}}>R$ {total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          )}
          <button className="btn-finalizar" onClick={handleFinalizar} disabled={carrinho.length === 0 || !clienteId}>
            <FontAwesomeIcon icon={faCheckCircle} style={{marginRight: 6}} /> Finalizar Venda
          </button>
        </div>
      </div>
      {mensagem && <div className="mensagem-sucesso">{mensagem}</div>}
      {erro && <div className="mensagem-erro">{erro}</div>}
    </div>
  );
} 