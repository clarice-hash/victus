/**
 * Serviço de autenticação para a aplicação Victus
 * Centraliza toda a lógica de autenticação e gestão de tokens
 */

import { API_BASE_URL } from '../config/environment';

// Configuração da API usando variáveis de ambiente

/**
 * Classe para gestão segura de tokens
 * Evita localStorage por questões de segurança (XSS attacks)
 * Usa sessionStorage como alternativa mais segura
 */
class TokenManager {
  static TOKEN_KEY = 'victus_auth_token';
  static USER_KEY = 'victus_user_data';

  /**
   * Armazena o token de forma segura
   * @param {string} token - JWT token
   * @param {Object} userData - Dados do utilizador
   */
  static setToken(token, userData = null) {
    try {
      // sessionStorage é mais seguro que localStorage
      // Token expira quando o browser é fechado
      sessionStorage.setItem(this.TOKEN_KEY, token);
      
      if (userData) {
        sessionStorage.setItem(this.USER_KEY, JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Erro ao armazenar token:', error);
    }
  }

  /**
   * Recupera o token armazenado
   * @returns {string|null} Token JWT ou null se não existir
   */
  static getToken() {
    try {
      return sessionStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('Erro ao recuperar token:', error);
      return null;
    }
  }

  /**
   * Recupera dados do utilizador
   * @returns {Object|null} Dados do utilizador ou null
   */
  static getUserData() {
    try {
      const userData = sessionStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Erro ao recuperar dados do utilizador:', error);
      return null;
    }
  }

  /**
   * Remove token e dados do utilizador
   */
  static clearAuth() {
    try {
      sessionStorage.removeItem(this.TOKEN_KEY);
      sessionStorage.removeItem(this.USER_KEY);
    } catch (error) {
      console.error('Erro ao limpar autenticação:', error);
    }
  }

  /**
   * Verifica se o utilizador está autenticado
   * @returns {boolean} True se autenticado
   */
  static isAuthenticated() {
    return !!this.getToken();
  }
}

/**
 * Serviço de autenticação
 */
class AuthService {
  /**
   * Realiza login do utilizador
   * @param {string} email - Email do utilizador
   * @param {string} password - Password do utilizador
   * @returns {Promise<Object>} Resultado do login
   */
  static async login(email, password) {
    try {
      // Validação básica dos inputs
      if (!email || !password) {
        throw new Error('Email e password são obrigatórios');
      }

      // Validação do formato do email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Formato de email inválido');
      }

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(), 
          password 
        })
      });

      // Verificar se a resposta é JSON válido
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Resposta não é JSON:', textResponse);
        throw new Error('Erro do servidor. Verifique se o XAMPP está a correr.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Erro HTTP: ${response.status}`);
      }

      if (data.token) {
        // Armazenar token e dados do utilizador de forma segura
        TokenManager.setToken(data.token, data.user);
        
        return {
          success: true,
          token: data.token,
          user: data.user
        };
      } else {
        throw new Error(data.error || 'Credenciais inválidas');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Realiza logout do utilizador
   */
  static logout() {
    TokenManager.clearAuth();
    // Redirecionar para login
    window.location.href = '/';
  }

  /**
   * Verifica se o utilizador está autenticado
   * @returns {boolean} Estado de autenticação
   */
  static isAuthenticated() {
    return TokenManager.isAuthenticated();
  }

  /**
   * Recupera dados do utilizador atual
   * @returns {Object|null} Dados do utilizador
   */
  static getCurrentUser() {
    return TokenManager.getUserData();
  }

  /**
   * Recupera o token atual
   * @returns {string|null} Token JWT
   */
  static getToken() {
    return TokenManager.getToken();
  }

  /**
   * Recuperação de password
   * @param {string} email - Email para recuperação
   * @returns {Promise<Object>} Resultado da recuperação
   */
  static async recoverPassword(email) {
    try {
      if (!email) {
        throw new Error('Email é obrigatório');
      }

      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro na recuperação');
      }

      return {
        success: true,
        message: data.message
      };
    } catch (error) {
      console.error('Erro na recuperação:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default AuthService;
export { TokenManager };
