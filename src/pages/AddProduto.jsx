import React, { useState, useEffect } from 'react';
import { categoryService } from '../services/categoryService';
import { fornecedorService } from '../services/fornecedorService';
import { productService } from '../services/productService';
import { pedidoService } from '../services/pedidoService';
import './AddProduto.css';
import Voltar from '../components/Voltar';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faFileCirclePlus, faCalendarPlus } from '@fortawesome/free-solid-svg-icons';

function AddProduto() {
  const [produtos, setProdutos] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [produtoExistente, setProdutoExistente] = useState('');
  const [novoProduto, setNovoProduto] = useState(false);
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [preco, setPreco] = useState('');
  const [precoVenda, setPrecoVenda] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [fornecedor, setFornecedor] = useState('');
  const [tempoEntrega, setTempoEntrega] = useState('');
  const [custoTotal, setCustoTotal] = useState(0);
  const [resumo, setResumo] = useState(null);
  const [erro, setErro] = useState('');
  const [erroFornecedor, setErroFornecedor] = useState('');
  const [novoFornecedor, setNovoFornecedor] = useState(false);
  const [nomeFornecedor, setNomeFornecedor] = useState('');
  const [contatoFornecedor, setContatoFornecedor] = useState('');
  const [tempoEntregaFornecedor, setTempoEntregaFornecedor] = useState('');
  const [emailFornecedor, setEmailFornecedor] = useState('');
  const [telefoneFornecedor, setTelefoneFornecedor] = useState('');
  const [addCategoria, setAddCategoria] = useState('');
  const [descricao, setDescricao] = useState('');
  const [descricaoCategoria, setDescricaoCategoria] = useState('');
  const [mostrarCampoNovaCategoria, setMostrarCampoNovaCategoria] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProdutos() {
      try {
        const response = await productService.getProducts();
        setProdutos(response.data || []);
      } catch (error) {
        setProdutos([]);
      }
    }
    async function fetchCategorias() {
      try {
        const response = await categoryService.getCategories();
        setCategorias(response.data || []);
      } catch (error) {
        setCategorias([]);
      }
    }
    async function fetchFornecedores() {
      try {
        const lista = await fornecedorService.getFornecedores();
        setFornecedores(lista);
      } catch (error) {
        setFornecedores([]);
      }
    }
    fetchProdutos();
    fetchCategorias();
    fetchFornecedores();
  }, []);

  useEffect(() => {
    if (fornecedor) {
      const f = fornecedores.find(f => String(f.id) === String(fornecedor));
      setTempoEntrega(f ? f.tempo_entrega : '');
    } else {
      setTempoEntrega('');
    }
  }, [fornecedor, fornecedores]);

  useEffect(() => {
    let valor = 0;
    if (novoProduto) {
      valor = parseFloat(preco) || 0;
    } else if (produtoExistente) {
      const prod = produtos.find(p => String(p.id) === String(produtoExistente));
      valor = prod ? parseFloat(prod.valor || prod.preco || 0) : 0;
    }
    setCustoTotal(valor * (parseInt(quantidade) || 0));
  }, [preco, quantidade, produtoExistente, novoProduto, produtos]);

  function handleProdutoChange(e) {
    const value = e.target.value;
    setProdutoExistente(value);
    setNovoProduto(value === 'novo');
    if (value !== 'novo') {
      setNome('');
      setCategoria('');
      setPreco('');
      setPrecoVenda('');
    }
  }

  function handleFornecedorChange(e) {
    const value = e.target.value;
    setFornecedor(value);
    setNovoFornecedor(value === 'novo');
    if (value !== 'novo') {
      setNomeFornecedor('');
      setContatoFornecedor('');
      setEmailFornecedor('');
      setTelefoneFornecedor('');
      setTempoEntregaFornecedor('');
    }
  }

  function handleResumo(e) {
    e.preventDefault();
    setErro('');
    setResumo({
      produto: novoProduto ? nome : (produtos.find(p => String(p.id) === String(produtoExistente))?.nome || ''),
      categoria: mostrarCampoNovaCategoria ? addCategoria : (novoProduto ? (categorias.find(c => String(c.id) === String(categoria))?.nome || '') : (produtos.find(p => String(p.id) === String(produtoExistente))?.categoria_nome || '')),
      categoriaDescricao: mostrarCampoNovaCategoria ? descricaoCategoria : '',
      preco: novoProduto ? preco : (produtos.find(p => String(p.id) === String(produtoExistente))?.valor || ''),
      precoVenda: novoProduto ? precoVenda : (produtos.find(p => String(p.id) === String(produtoExistente))?.precoVenda || ''),
      quantidade,
      fornecedor: novoFornecedor ? nomeFornecedor : (fornecedores.find(f => String(f.id) === String(fornecedor))?.nome || ''),
      contatoFornecedor: novoFornecedor ? contatoFornecedor : (fornecedores.find(f => String(f.id) === String(fornecedor))?.contato?.telefone || ''),
      tempoEntrega: novoFornecedor ? tempoEntregaFornecedor : tempoEntrega,
      custoTotal
    });
  }

  async function handleConfirmar() {
    if (isProcessing) return;
    if (mostrarCampoNovaCategoria && addCategoria.trim()) {
      setErro('Salve a nova categoria antes de confirmar a compra.');
      setIsProcessing(false);
      return;
    }
    setIsProcessing(true);
    let fornecedorId = fornecedor;
    if (novoFornecedor) {
      try {
        const fornecedorCadastrado = await fornecedorService.cadastrarFornecedor({
          nome: nomeFornecedor,
          situacao: 1,
          email: emailFornecedor,
          telefone: telefoneFornecedor,
          tempo_entrega: parseInt(tempoEntregaFornecedor, 10)
        });
        fornecedorId = fornecedorCadastrado.id;
        const lista = await fornecedorService.getFornecedores();
        setFornecedores(lista);
        setFornecedor(fornecedorId);
      } catch (error) {
        setErroFornecedor(error.message || 'Erro ao cadastrar fornecedor');
        setIsProcessing(false);
        return;
      }
    }
    let categoriaId = categoria;
    if (mostrarCampoNovaCategoria && addCategoria.trim()) {
      try {
        const novaCat = await categoryService.createCategory({ nome: addCategoria, descricao: descricaoCategoria });
        categoriaId = novaCat.id;
        setCategoria(categoriaId);
        const response = await categoryService.getCategories();
        setCategorias(response.data || []);
        setMostrarCampoNovaCategoria(false);
      } catch (error) {
        if (error.response && error.response.status === 409) {
          const response = await categoryService.getCategories();
          const existente = (response.data || []).find(cat => cat.nome === addCategoria);
          if (existente) {
            categoriaId = existente.id;
            setCategoria(categoriaId);
            setMostrarCampoNovaCategoria(false);
          } else {
            setErro('Já existe uma categoria com esse nome, mas não foi possível selecioná-la automaticamente. Selecione manualmente.');
            setIsProcessing(false);
            return;
          }
        } else {
          setErro('Erro ao criar nova categoria');
          setIsProcessing(false);
          return;
        }
      }
    }
    if (novoProduto && (!categoriaId || isNaN(Number(categoriaId)))) {
      setErro('Selecione ou crie uma categoria válida antes de criar o produto.');
      setIsProcessing(false);
      return;
    }
    const pedido = {
      nome: novoProduto ? nome : (produtos.find(p => String(p.id) === String(produtoExistente))?.nome || ''),
      valor: novoProduto ? preco : (produtos.find(p => String(p.id) === String(produtoExistente))?.valor || ''),
      tipo: 'compra',
      produto_id: novoProduto ? null : produtoExistente,
      quantidade: parseInt(quantidade, 10),
      fornecedor_id: fornecedorId,
      tempo_entrega: parseInt(tempoEntregaFornecedor, 10),
      novo_produto: novoProduto ? {
        nome,
        categoria_id: parseInt(categoriaId, 10),
        valor: parseFloat(preco),
        vendapreco: parseFloat(precoVenda),
        descricao
      } : undefined
    };
    try {
      await pedidoService.createPedido(pedido);
      alert('Compra registrada com sucesso!');
      setProdutoExistente('');
      setNovoProduto(false);
      setNome('');
      setCategoria('');
      setPreco('');
      setPrecoVenda('');
      setQuantidade('');
      setFornecedor('');
      setTempoEntrega('');
      setCustoTotal(0);
      setResumo(null);
      setNovoFornecedor(false);
      setNomeFornecedor('');
      setContatoFornecedor('');
      setTempoEntregaFornecedor('');
      setEmailFornecedor('');
      setTelefoneFornecedor('');
      setAddCategoria('');
      setDescricao('');
      setDescricaoCategoria('');
      setMostrarCampoNovaCategoria(false);
      navigate('/compras');
    } catch (error) {
      setErro(error.message || 'Erro ao registrar compra');
    }
    setIsProcessing(false);
  }

  async function handleSalvarCategoria(e) {
    e.preventDefault();
    if (!addCategoria.trim()) {
      setErro('Informe o nome da nova categoria.');
      return;
    }
    setIsProcessing(true);
    let categoriaId = categoria;
    try {
      const novaCat = await categoryService.createCategory({ nome: addCategoria, descricao: descricaoCategoria });
      categoriaId = novaCat.id;
      setCategoria(categoriaId);
      const response = await categoryService.getCategories();
      setCategorias(response.data || []);
      setMostrarCampoNovaCategoria(false);
      setErro('');
    } catch (error) {
      if (error.response && error.response.status === 409) {
        const response = await categoryService.getCategories();
        const existente = (response.data || []).find(cat => cat.nome === addCategoria);
        if (existente) {
          categoriaId = existente.id;
          setCategoria(categoriaId);
          setMostrarCampoNovaCategoria(false);
          setErro('');
        } else {
          setErro('Já existe uma categoria com esse nome, mas não foi possível selecioná-la automaticamente. Selecione manualmente.');
        }
      } else {
        setErro('Erro ao criar nova categoria');
      }
    }
    setIsProcessing(false);
  }

  return (
    <div className="add-produto-page">
      <Voltar to="/compras" title="Voltar às Compras" showHome={true} />
      <h1>Registrar Compra de Produto</h1>
      {erro && <div className="erro-categorias">{erro}</div>}
      {erroFornecedor && <div className="erro-categorias">{erroFornecedor}</div>}
      {!resumo ? (
        <form className="add-produto-form" onSubmit={handleResumo}>
          <div className="form-group">
            <label>Produto:</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <select value={produtoExistente} onChange={handleProdutoChange} required={!novoProduto}>
                <option value="">Selecione um produto</option>
                {produtos.map(p => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
              <button
                type="button"
                className="btn-add-icone-venda"
                onClick={() => setNovoProduto(true)}
                title="Adicionar novo produto"
                aria-label="Adicionar novo produto"
              >
                <FontAwesomeIcon icon={faFileCirclePlus} />
              </button>
            </div>
          </div>
          {novoProduto && (
            <>
              <div className="form-group">
                <label>Nome do Produto:</label>
                <input type="text" value={nome} onChange={e => setNome(e.target.value)} required={novoProduto} />
              </div>
              <div className="form-group">
                <label>Categoria:</label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <select value={categoria} onChange={e => {
                    setCategoria(e.target.value);
                    if (e.target.value === 'nova') setMostrarCampoNovaCategoria(true);
                    else setMostrarCampoNovaCategoria(false);
                  }} required={novoProduto && categoria !== 'nova'}>
                    <option value="">Selecione uma categoria</option>
                    {categorias.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nome || cat.name}</option>
                    ))}
                    <option value="nova">+ Nova Categoria</option>
                  </select>
                  <button
                    type="button"
                    className="btn-add-icone-venda"
                    onClick={() => {
                      setMostrarCampoNovaCategoria(true);
                      setCategoria('nova');
                    }}
                    title="Adicionar nova categoria"
                    aria-label="Adicionar nova categoria"
                  >
                    <FontAwesomeIcon icon={faCalendarPlus} />
                  </button>
                </div>
              </div>
              {mostrarCampoNovaCategoria && (
                <>
                  <div className="form-group">
                    <label>Nova Categoria:</label>
                    <input type="text" value={addCategoria} onChange={e => setAddCategoria(e.target.value)} placeholder="Nome da nova categoria" required={mostrarCampoNovaCategoria} />
                  </div>
                  <div className="form-group">
                    <label>Descrição da Categoria:</label>
                    <textarea value={descricaoCategoria} onChange={e => setDescricaoCategoria(e.target.value)} rows={2} placeholder="Descrição da nova categoria" />
                  </div>
                  <button type="button" className="btn-adicionar" onClick={handleSalvarCategoria} disabled={isProcessing} style={{marginBottom: 12}}>Salvar Categoria</button>
                </>
              )}
              <div className="form-group">
                <label>Descrição do Produto:</label>
                <textarea value={descricao} onChange={e => setDescricao(e.target.value)} rows={3} placeholder="Descrição do novo produto" />
              </div>
              <div className="form-group">
                <label>Preço unitário:</label>
                <input type="number" step="0.01" value={preco} onChange={e => setPreco(e.target.value)} required={novoProduto} />
              </div>
              <div className="form-group">
                <label>Valor de venda:</label>
                <input type="number" step="0.01" value={precoVenda} onChange={e => setPrecoVenda(e.target.value)} required={novoProduto} />
              </div>
            </>
          )}
          {!novoProduto && produtoExistente && (
            <div className="form-group">
              <label>Preço unitário:</label>
              <input type="number" value={produtos.find(p => String(p.id) === String(produtoExistente))?.valor || ''} readOnly />
            </div>
          )}
          <div className="form-group">
            <label>Quantidade:</label>
            <input type="number" value={quantidade} onChange={e => setQuantidade(e.target.value)} required min="1" />
          </div>
          <div className="form-group">
            <label>Fornecedor:</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <select value={fornecedor} onChange={handleFornecedorChange} required={!novoFornecedor}>
                <option value="">Selecione um fornecedor</option>
                {fornecedores.map(f => (
                  <option key={f.id} value={f.id}>{f.nome}</option>
                ))}
              </select>
              <button
                type="button"
                className="btn-add-icone-venda"
                onClick={() => setNovoFornecedor(true)}
                title="Adicionar novo fornecedor"
                aria-label="Adicionar novo fornecedor"
              >
                <FontAwesomeIcon icon={faUserPlus} />
              </button>
            </div>
          </div>
          {novoFornecedor && (
            <>
              <div className="form-group">
                <label>Nome do Fornecedor:</label>
                <input type="text" value={nomeFornecedor} onChange={e => setNomeFornecedor(e.target.value)} required={novoFornecedor} />
              </div>
              <div className="form-group">
                <label>Email do Fornecedor:</label>
                <input type="email" value={emailFornecedor} onChange={e => setEmailFornecedor(e.target.value)} required={novoFornecedor} />
              </div>
              <div className="form-group">
                <label>Telefone do Fornecedor:</label>
                <input type="text" value={telefoneFornecedor} onChange={e => setTelefoneFornecedor(e.target.value)} required={novoFornecedor} />
              </div>
              <div className="form-group">
                <label>Tempo de entrega (dias):</label>
                <input type="number" min="1" value={tempoEntregaFornecedor} onChange={e => setTempoEntregaFornecedor(e.target.value)} required={novoFornecedor} />
              </div>
            </>
          )}
          {tempoEntrega && !novoFornecedor && (
            <div className="form-group">
              <label>Tempo de entrega:</label>
              <input type="text" value={tempoEntrega} readOnly />
            </div>
          )}
          <div className="form-group">
            <label>Custo total:</label>
            <input type="text" value={custoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} readOnly />
          </div>
          <button type="submit" className="btn-adicionar" disabled={isProcessing}>Ver Resumo</button>
        </form>
      ) : (
        <div className="resumo-compra">
          <h2>Resumo da Compra</h2>
          <ul>
            <li><b>Produto:</b> {resumo.produto}</li>
            {resumo.categoria && (
            <li><b>Categoria:</b> {resumo.categoria}</li>
            )}
            {resumo.categoriaDescricao && (
              <li><b>Descrição da Categoria:</b> {resumo.categoriaDescricao}</li>
            )}
            <li><b>Preço unitário:</b> {parseFloat(resumo.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</li>
            <li><b>Valor de venda:</b> {parseFloat(resumo.precoVenda).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</li>
            <li><b>Quantidade:</b> {resumo.quantidade}</li>
            <li><b>Fornecedor:</b> {resumo.fornecedor}</li>
            <li><b>Tempo de entrega:</b> {resumo.tempoEntrega}</li>
            <li><b>Custo total:</b> {custoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</li>
          </ul>
          <button className="btn-adicionar" onClick={handleConfirmar} disabled={isProcessing}>Confirmar Compra</button>
          <button className="btn-adicionar" style={{ background: '#aaa', marginTop: 8 }} onClick={() => setResumo(null)}>Voltar</button>
        </div>
      )}
    </div>
  );
}

export default AddProduto; 