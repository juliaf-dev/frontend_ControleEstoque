import api from './api';

export const pedidoService = {
  // Listar pedidos
  async getPedidos() {
    try {
      const response = await api.get('/pedidos/listar');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar pedidos' };
    }
  },

  // Buscar pedido por ID
  async getPedido(id) {
    try {
      const response = await api.get(`/pedidos/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar pedido' };
    }
  },

  // Criar pedido
  async createPedido(pedidoData) {
    try {
      const response = await api.post('/pedidos/registrar', pedidoData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao criar pedido' };
    }
  },

  // Atualizar pedido
  async updatePedido(id, pedidoData) {
    try {
      const response = await api.put(`/pedidos/atualizar/${id}`, pedidoData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao atualizar pedido' };
    }
  },

  // Deletar pedido
  async deletePedido(id) {
    try {
      const response = await api.delete(`/pedidos/apagar/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao deletar pedido' };
    }
  },

  // Marcar pedido como recebido
  async receberPedido(id) {
    try {
      const response = await api.put(`/pedidos/receber/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao marcar pedido como recebido' };
    }
  },

  // Cancelar pedido
  async cancelarPedido(id) {
    try {
      const response = await api.put(`/pedidos/cancelar/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao cancelar pedido' };
    }
  }
}; 