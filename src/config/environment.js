// Configuração de ambiente
const config = {
  // URL da API - agora usa o backend local
  API_URL: 'http://localhost:3000'
};

// Exportar configuração
export const getConfig = () => {
  return config;
};

export default config; 