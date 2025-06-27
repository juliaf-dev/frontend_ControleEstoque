import api from './api';

export const categoryService = {
  // Listar categorias
  async getCategories() {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar categorias' };
    }
  },

  // Buscar categoria por ID
  async getCategory(id) {
    try {
      const response = await api.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar categoria' };
    }
  },

  // Criar categoria
  async createCategory(categoryData) {
    try {
      const response = await api.post('/categories', categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao criar categoria' };
    }
  },

  // Atualizar categoria
  async updateCategory(id, categoryData) {
    try {
      const response = await api.put(`/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao atualizar categoria' };
    }
  },

  // Deletar categoria
  async deleteCategory(id) {
    try {
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao deletar categoria' };
    }
  }
}; 