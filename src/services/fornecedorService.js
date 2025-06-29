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

  async getProdutosDoFornecedor(id) {
    try {
      const response = await api.get(`/fornecedor/${id}/produtos`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar produtos do fornecedor' };
    }
  }
}; 