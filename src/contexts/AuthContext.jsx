import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há usuário logado ao carregar a aplicação
    const currentUser = authService.getCurrentUser();
    if (currentUser && authService.isAuthenticated()) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, senha) => {
    try {
      const response = await authService.login(email, senha);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const cadastro = async (nome, email, senha, tipo) => {
    try {
      const response = await authService.cadastro(nome, email, senha, tipo);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const recuperarSenha = async (email) => {
    try {
      const response = await authService.recuperarSenha(email);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    cadastro,
    logout,
    recuperarSenha,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 