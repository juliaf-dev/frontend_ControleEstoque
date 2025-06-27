import api from './api';

export const fornecedorService = {
  async getFornecedores() {
    try {
      const response = await api.get('/fornecedor/listar');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar fornecedores' };
    }
  },

  // Fornecedores fake para testes
  getFakeFornecedores() {
    return [
      {
        id: 1,
        nome: 'Fornecedor Exemplo 1',
        situacao: 1,
        tempo_entrega: '3 dias',
        contato: {
          nome: 'João Silva',
          telefone: '(11) 99999-1111',
          email: 'joao@exemplo.com'
        },
        pedidos: [
          { id: 101, data: '2024-06-01', valor: 1500.00 },
          { id: 102, data: '2024-06-10', valor: 800.00 }
        ]
      },
      {
        id: 2,
        nome: 'Fornecedor Exemplo 2',
        situacao: 1,
        tempo_entrega: '7 dias',
        contato: {
          nome: 'Maria Souza',
          telefone: '(21) 98888-2222',
          email: 'maria@exemplo.com'
        },
        pedidos: [
          { id: 103, data: '2024-05-20', valor: 2000.00 }
        ]
      },
      {
        id: 3,
        nome: 'Fornecedor Exemplo 3',
        situacao: 0,
        tempo_entrega: '5 dias',
        contato: {
          nome: 'Carlos Lima',
          telefone: '(31) 97777-3333',
          email: 'carlos@exemplo.com'
        },
        pedidos: []
      }
    ];
  },

  async getProdutosDoFornecedor(id) {
    try {
      const response = await api.get(`/fornecedor/${id}/produtos`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar produtos do fornecedor' };
    }
  }
}; 