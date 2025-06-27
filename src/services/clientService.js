import api from './api';

export const clientService = {
  async getClients() {
    try {
      const response = await api.get('/clients');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar clientes' };
    }
  },
  async updateClient(id, clientData) {
    try {
      const response = await api.put(`/clients/${id}`, clientData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao atualizar cliente' };
    }
  }
}; 