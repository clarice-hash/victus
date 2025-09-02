/**
 * Configuração de ambiente para a aplicação Victus
 * Centraliza URLs e configurações baseadas no ambiente
 */

const config = {
  development: {
    API_BASE_URL: 'http://localhost/victus/api/public/api',
    APP_NAME: 'Victus - Desenvolvimento',
    DEBUG: true
  },
  production: {
    API_BASE_URL: process.env.REACT_APP_API_URL || 'https://api.victus.com',
    APP_NAME: 'Victus',
    DEBUG: false
  }
};

// Detectar ambiente atual
const environment = process.env.NODE_ENV || 'development';

// Exportar configuração do ambiente atual
export default config[environment];

// Exportar configurações específicas
export const API_BASE_URL = config[environment].API_BASE_URL;
export const APP_NAME = config[environment].APP_NAME;
export const DEBUG = config[environment].DEBUG;
