import api from './api';

export const productService = {
  // Listar produtos
  async getProducts(params = {}) {
    try {
      const response = await api.get('/products', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar produtos' };
    }
  },

  // Buscar produto por ID
  async getProduct(id) {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar produto' };
    }
  },

  // Criar produto
  async createProduct(productData) {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao criar produto' };
    }
  },

  // Atualizar produto
  async updateProduct(id, productData) {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao atualizar produto' };
    }
  },

  // Deletar produto
  async deleteProduct(id) {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao deletar produto' };
    }
  },

  // Atualizar estoque
  async updateStock(id, quantidade, tipo) {
    try {
      const response = await api.patch(`/products/${id}/estoque`, {
        quantidade,
        tipo
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao atualizar estoque' };
    }
  },

  // Produtos com estoque baixo
  async getLowStockProducts(limite = 10) {
    try {
      const response = await api.get('/products/low-stock', {
        params: { limite }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar produtos com estoque baixo' };
    }
  },

  // Listar fornecedores de um produto
  async getProductSuppliers(id) {
    try {
      const response = await api.get(`/products/${id}/fornecedores`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar fornecedores do produto' };
    }
  },

  // Vincular fornecedores a um produto
  async addSuppliersToProduct(id, fornecedores) {
    try {
      const response = await api.post(`/products/${id}/fornecedores`, { fornecedores });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao vincular fornecedores ao produto' };
    }
  },

  // Desvincular fornecedor de um produto
  async removeSupplierFromProduct(id, fornecedorId) {
    try {
      const response = await api.delete(`/products/${id}/fornecedores/${fornecedorId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao desvincular fornecedor do produto' };
    }
  }
}; 