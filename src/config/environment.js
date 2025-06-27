// Configuração de ambiente
const config = {
  // URL da API - pode ser configurada via variável de ambiente
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  
  // Configurações para diferentes ambientes
  development: {
    API_URL: 'http://localhost:3000'
  },
  
  production: {
    API_URL: 'https://seu-app.onrender.com' // Substitua pela URL real do Render
  }
};

// Determinar ambiente atual
const environment = import.meta.env.MODE || 'development';

// Exportar configuração baseada no ambiente
export const getConfig = () => {
  return {
    ...config,
    ...config[environment]
  };
};

export default config; 