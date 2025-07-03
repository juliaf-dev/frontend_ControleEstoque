import React, { useEffect, useState } from 'react';
import MainButtons from '../components/MainButtons';
import ProdutosSection from '../components/ProdutosSection';
import { productService } from '../services/productService';
import { pedidoService } from '../services/pedidoService';
import './Dashboard.css';

export default function Dashboard() {
  const [produtosCriticos, setProdutosCriticos] = useState([]);

  useEffect(() => {
    async function fetchEstoqueBaixo() {
      try {
        // Buscar todos os produtos
        const produtosRes = await productService.getProducts();
        const produtos = produtosRes.data || [];
        // Buscar histórico de pedidos
        const pedidos = await pedidoService.getPedidos();
        const agora = new Date();
        const trintaDiasAtras = new Date(agora.getTime() - 30 * 24 * 60 * 60 * 1000);
        // Filtrar vendas dos últimos 30 dias
        const vendasUlt30d = pedidos.filter(p => p.tipo === 'venda' && p.produto_id && new Date(p.createdAt) >= trintaDiasAtras);
        // Calcular vendas por produto
        const vendasPorProduto = {};
        vendasUlt30d.forEach(v => {
          if (!vendasPorProduto[v.produto_id]) vendasPorProduto[v.produto_id] = 0;
          vendasPorProduto[v.produto_id] += Number(v.quantidade);
        });
        // Montar lista de produtos críticos
        const criticos = produtos.filter(prod => {
          // Estoque baixo padrão
          if (prod.quantidade_estoque < 5) return true;
          // Alta saída: vendeu >= 10 nos últimos 30 dias e estoque menor que a média
          const vendas = vendasPorProduto[prod.id] || 0;
          if (vendas >= 10 && prod.quantidade_estoque < vendas) return true;
          return false;
        }).map(prod => {
          const vendas = vendasPorProduto[prod.id] || 0;
          return {
            nome: prod.nome,
            quantidade_estoque: prod.quantidade_estoque,
            vendasUlt30d: vendas
          };
        });
        setProdutosCriticos(criticos);
      } catch (err) {
        setProdutosCriticos([]);
      }
    }
    fetchEstoqueBaixo();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="alerta-estoque-baixo">
        {produtosCriticos.length === 0 ? (
          'Estoque em dia!'
        ) : (
          <>
            Atenção: Estoque baixo nos produtos:<br />
            <ul style={{margin: 0, paddingLeft: 18}}>
              {produtosCriticos.map((p, i) => (
                <li key={i}>
                  {p.nome} (Estoque: {p.quantidade_estoque}{p.vendasUlt30d >= 10 ? `, Vendas/mês: ${p.vendasUlt30d}` : ''})
                </li>
              ))}
            </ul>
            Reponha o estoque o quanto antes.
          </>
        )}
      </div>
      <MainButtons />
      <ProdutosSection />
    </div>
  );
} 