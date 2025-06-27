import api from './api';

export const authService = {
  // Login
  async login(email, senha) {
    try {
      const response = await api.post('/auth/login', { email, senha });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao fazer login' };
    }
  },

  // Cadastro
  async cadastro(nome, email, senha, tipo = 'usuario') {
    try {
      const response = await api.post('/auth/registrar', {
        nome,
        email,
        senha,
        tipo
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao fazer cadastro' };
    }
  },

  // Recuperação de senha
  async recuperarSenha(email) {
    try {
      const response = await api.post('/auth/recuperar-senha', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao solicitar recuperação de senha' };
    }
  },

  // Resetar senha
  async resetarSenha(token, novaSenha) {
    try {
      const response = await api.post('/auth/resetar-senha', { token, novaSenha });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao resetar senha' };
    }
  },

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Verificar se está autenticado
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  // Obter usuário atual
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}; 