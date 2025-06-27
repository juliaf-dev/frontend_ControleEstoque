import React, { useState, useEffect } from 'react';
import Voltar from '../components/Voltar';
import './AddProduto.css';

function Compra() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const pedidosSalvos = JSON.parse(localStorage.getItem('compras_pedidos') || '[]');
    setPedidos(pedidosSalvos.reverse()); // Mostra o mais recente primeiro
  }, []);

  return (
    <div className="add-produto-page">
      <Voltar />
      <h1>Notas Fiscais de Compras</h1>
      {pedidos.length === 0 ? (
        <div style={{textAlign: 'center', marginTop: 32}}>Nenhuma compra registrada ainda.</div>
      ) : (
        <div className="lista-notas-fiscais">
          {pedidos.map((pedido, idx) => (
            <div className="nota-fiscal-item" key={idx}>
              <div><b>Data:</b> {pedido.data}</div>
              <div><b>Produto:</b> {pedido.produto}</div>
              <div><b>Categoria:</b> {pedido.categoria}</div>
              <div><b>Fornecedor:</b> {pedido.fornecedor}</div>
              <div><b>Contato:</b> {pedido.contatoFornecedor}</div>
              <div><b>Quantidade:</b> {pedido.quantidade}</div>
              <div><b>Preço unitário:</b> {parseFloat(pedido.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
              {pedido.precoVenda && (
                <div><b>Valor de venda:</b> {parseFloat(pedido.precoVenda).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
              )}
              <div><b>Custo total:</b> {parseFloat(pedido.custoTotal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
              <div><b>Tempo de entrega:</b> {pedido.tempoEntrega}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Compra; 