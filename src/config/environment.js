// Configuração de ambiente
const config = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000'
};

// Exportar configuração
export const getConfig = () => {
  return config;
};

export default config; 